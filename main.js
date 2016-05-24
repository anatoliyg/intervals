'use strict';

const readline = require('readline');
const Promise = require('promise');
const _ = require('lodash');

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    notesLength = notes.length;

let progress = {total: 0, got: 0, missed: 0 },
    questions = [];

const notesDistances = notes.map(function(item, index) {
    var obj = {};
    obj[item] = index;
    return obj;
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('line', function(line) {
    //not using but good to have
}).on('close', function() {
    process.exit(0);
});


//HELPER FUNCTIONS
const getDistance = (note1, note2, direction) => {

    let index1 = notes.indexOf(note1),
        index2 = notes.indexOf(note2);

    if (index1 === index2)
        return 0; //handle same note

    if (direction === 'forward')
        return index1 < index2 ? index2 - index1 : index2 + 12 - index1;
    return index1 > index2 ? index1 - index2 : index1 + 12 - index2;
}

const getRandomNote = () => {
    return notes[Math.floor(Math.random() * notesLength)];
}

const generateQuestions = () => {

    let questions = [];
    for (let i = 0; i < 20; i++) {
        let randNote1 = getRandomNote(),
            randNode2 = getRandomNote(),
            result = 1;

        let question = {
            note1: getRandomNote(),
            note2: getRandomNote(),
            direction: Math.random() > 0.5 ? 'forward' : 'backward',
        }
        question.answer = getDistance(question.note1, question.note2, question.direction)
        questions.push(question);
    }
    return questions;
}


//LOGIC HELPER FUNCTIONS
const incrementScore = () => {
    progress.total += 1;
    progress.got += 1;
}

const decrementScore = () => {
    progress.total += 1;
    progress.missed += 1;
}

const getScore = () => {
   return 'You got ' + progress.got + ' out of ' + progress.total + ' right.'
}

const getExclamation = (perc) => {
    if (perc >= 0 && perc < 50)
        return 'laaaame...'
    else if (perc >= 50 && perc < 75)
        return 'not too bad...'
    else if (perc >= 75 && perc < 85)
        return 'good job, buddy'
    else if (perc >= 85 && perc < 97)
        return 'excellent!'
    else if (perc >= 97 && perc <= 100)
        return 'PERFECTO!!!!'
}

const askQuestion = (index) => {
    let q = questions[index];
    let questionString = 'going ' + q.direction + ' from ' + q.note1 + ' to ' + q.note2 + ', how many semitones do you have to move? > ';
    return new Promise(function(fulfill, reject) {
        rl.question(questionString, (answer) => {
            if (_.trim(answer) == _.trim(q.answer)) {
                incrementScore();
                rl.setPrompt('Very Nice... ' + getScore());
                rl.prompt();
                _.delay(function() {
                    fulfill();
                }, 4000)
            } else {
                decrementScore();
                rl.setPrompt('Naaah bro, its ' + q.answer + ' ' + getScore());
                rl.prompt();
                _.delay(function() {
                    fulfill();
                }, 4000)
            }
        });
    });
}

const startQuiz = () => {
    return new Promise(function(fulfill, reject) {
        rl.setPrompt('Hello, Pal, its time we play a game');
        rl.prompt();

        _.delay(function(text) {
            rl.question('Are you ready? Type y/n > ', (answer) => {
                if (_.trim(answer) == 'y') {
                    rl.setPrompt('very well. we shell continue');
                    rl.prompt();
                    _.delay(function() {
                        fulfill(answer);
                    }, 5000)
                } else {
                    rl.setPrompt('next time, then. Goodbuy..');
                    rl.prompt();
                    _.delay(function() {reject(); rl.close(); }, 3000)
                }
            });
        }, 5000);
    });
}



const tallyUp = () => {
    const perc = Math.round((progress.got / progress.total) * 100);
    rl.setPrompt(getScore() + ' . Thats ' + perc + '%... ' + getExclamation(perc));
    rl.prompt();
    _.delay(function() { rl.close();}, 5000);
}


// HIGH LEVEL LOGIC, 
// can be created dymanically with a for loop

questions = generateQuestions();
startQuiz()

.then(function() {
    return askQuestion(0);
})
.then(function() {
    return askQuestion(1);
})
.then(function() {
    return askQuestion(2);
})
.then(function() {
    return askQuestion(3);
})
.then(function() {
    return askQuestion(4);
})
.then(function() {
    tallyUp();
});

//console.log(getExclamation(50));