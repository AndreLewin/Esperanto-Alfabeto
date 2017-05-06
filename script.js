const timeBetweenSounds = 1000;
const timeBeforeRepeat = 1200;
const timeGlowing = 500;

var letters = ['c', 'ĉ', 'ŝ', 'ĝ', 'ĵ', 'ŭ', 'j', 'ĥ'];
var sounds = [];
for (var i = 0; i < letters.length; i++) {
    sounds[letters[i]] = new Audio('media/' + letters[i] + '.mp3');
}
var cells = document.getElementsByClassName("cell");

var targetString = "";
var inputString = "";
var isStrict = false;
var serie = 0;


// When the button "Komenci" is pressed
document.getElementById("start").addEventListener("click", start);

function start() {
    disableCells();
    targetString = "";
    inputString = "";
    updateSerie(0);
    nextStep();
}


// When the button "Puna reĝimo" is pressed
document.getElementById("strict").addEventListener("click", strict);

function strict() {
    if (isStrict) {
        isStrict = false;
        document.getElementById('strict').classList.remove("blue-glow");
    } else {
        isStrict = true;
        document.getElementById('strict').classList.add("blue-glow");
    }
}


// Add an element to the target string and enunciate
function nextStep() {
    targetString = targetString + letters[Math.floor(Math.random() * letters.length)];
    updateSerie(serie + 1);
    enunciate(targetString);
}


function enunciate(string) {
    if (string.length > 0) {
        string = string.split('');
        var letter = string.shift();
        string = string.join('');
        blueCell(letter);
        sounds[letter].play();
        setTimeout(function () {
            unblueCells();
            enunciate(string);
        }, timeBetweenSounds);
    } else {
        activateCells();
    }
}


// On button click
for (var cell = 0; cell < cells.length; cell++) {
    cells[cell].addEventListener("click", cellClick);
}

function cellClick(event) {
    sounds[event.target.id].play();
    inputString = inputString + event.target.id;
    check();
}


// Check if the button pressed is correct, and if it ends
function check() {
    console.log(targetString[inputString.length - 1]);
    console.log(inputString[inputString.length - 1]);

    // If case of error
    if (inputString[inputString.length - 1] !== targetString[inputString.length - 1]){
        console.log("incorrect");
        inputString = "";

        // Unstrict or strict mode
        if (isStrict) {
            setTimeout(function () {
                disableCells();
                start();
            }, timeBeforeRepeat);
        } else {
            setTimeout(function () {
                disableCells();
                enunciate(targetString);
                // Glow red to show the error
                glow(true, "red");
                setTimeout(function () {
                    glow(false, "red");
                }, timeGlowing);
            }, timeBeforeRepeat);
        }

    // If correct, check if the round ends
    } else if (inputString.length === targetString.length) {
        console.log("correct");
        inputString = "";
        setTimeout(function () {
            disableCells();
            nextStep();
        }, timeBeforeRepeat);
    }
}


// update serie display and glow
function updateSerie(number) {
    serie = number;
    document.getElementById('notice').innerHTML = "Serio: " + serie;

    if (serie == 0 ) {
        document.getElementById('notice').classList.add("green");
        document.getElementById('notice').classList.remove("gold");
        glow(true, "red");
        setTimeout(function () {
            glow(false, "red");
        }, timeGlowing);
    }  else if (serie >= 2) {
        glow(true, "gold");
        setTimeout(function () {
            glow(false, "gold");
        }, timeGlowing);
        if (serie == 20 ) {
            document.getElementById('notice').classList.add("gold");
            document.getElementById('notice').classList.remove("green");
        }
    }
}


// Change the appearance of the cells
function activateCells() {
    for (var cell = 0; cell < cells.length; cell++) {
        cells[cell].classList.remove("disabled");
        cells[cell].classList.add("available");
    }
}

function disableCells() {
    for (var cell = 0; cell < cells.length; cell++) {
        cells[cell].classList.remove("available");
        cells[cell].classList.add("disabled");
    }
}

function blueCell(letter) {
    document.getElementById(letter).classList.add("blued");
}

function unblueCells() {
    for (var cell = 0; cell < cells.length; cell++) {
        cells[cell].classList.remove("blued");
    }
}


// Change the glow of "Serio: X"
function glow(activate, color) {
    if (activate) {
        document.getElementById('notice').classList.add(color + "-glow");
    } else {
        document.getElementById('notice').classList.remove(color + "-glow");
    }
}