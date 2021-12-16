import Game from "../game/game.js";

let game = null;

function loginButton(){
    
}

function startButtonHandler(e){
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
    startButton.addEventListener('click', (e) => {startButtonHandler(e)}, false);
}   

function quitButtonHandler(e){
    e.preventDefault();
    game.erase();

    const result = document.querySelector(".result");
    const config = document.querySelector(".config");

    result.style.visibility = "hidden";
    config.style.visibility = "visible";
}

function quitButton(){
    const quitButton = document.getElementsByClassName("quit-button")[0];
    quitButton.addEventListener('click', (e) => {quitButtonHandler(e)}, false);
}

function popupQuitHandler(e) {
    e.preventDefault();
    game.erase()

    const popup = document.querySelector(".popup")
    popup.style.display = "none";

    const result = document.querySelector(".result");
    const config = document.querySelector(".config");

    result.style.visibility = "hidden";
    config.style.visibility = "visible";
}

function popupQuit(){
    const popupQuit = document.querySelector(".popup-close")
    popupQuit.addEventListener('click', (e) => {popupQuitHandler(e)}, false);

}

function popupRestartHandler(e) {
    game.erase();
    const popup = document.querySelector(".popup");
    popup.style.display = "none";

    startButtonHandler(e);
}

function popupRestart(){
    const popupRestart = document.querySelector(".popup .restart-button");
    popupRestart.addEventListener('click', (e) => {popupRestartHandler(e)}, false);
}

function goToInstructionsHandler(e) {
    e.preventDefault();
    const instruction = document.getElementById("instructions");
    /*instruction.style.display = "none";*/
}

function goToInstructions() {
    const goToInstructions = document.querySelector(".go-to-instructions")
    goToInstructions.addEventListener('click', (e) => {goToInstructionsHandler(e)}, false);
}

function loadButtons(){
    startButton();
    quitButton();
    popupQuit();
    popupRestart();
    goToInstructions();
}


window.onload = () => {
    console.log("loading");
    loadButtons();
    
}

