import Game from "../game/game.js";

let game = null;

function loginButton(){
    
}

function beginGame(e){
    e.preventDefault();
    const holesInput = document.getElementById('holes-input');
    const seedsInput = document.getElementById('seeds-input');
    const playerFirstTurn = document.querySelector('input[name="turn"]:checked');

    game = new Game(holesInput.value,seedsInput.value, playerFirstTurn.value);

    const result = document.querySelector(".result");
    const config = document.querySelector(".config");

    result.style.visibility = "visible";
    config.style.visibility = "hidden";
}

function startButton(){
    const startButton = document.getElementsByClassName("start-button")[0];
    startButton.addEventListener('click', (e) => {beginGame(e)}, false);
}   

function quitGame(e){
    e.preventDefault();
    game.erase();

    const result = document.querySelector(".result");
    const config = document.querySelector(".config");

    result.style.visibility = "hidden";
    config.style.visibility = "visible";
}

function quitButton(){
    const quitButton = document.getElementsByClassName("quit-button")[0];
    quitButton.addEventListener('click', (e) => {quitGame(e)}, false);
}


function loadButtons(){
    startButton();
    quitButton();
}


window.onload = () => {
    console.log("loading");
    loadButtons();
    
}

