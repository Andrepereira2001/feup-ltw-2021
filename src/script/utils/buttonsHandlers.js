import Game from "../game/game.js";
import { register, ranking } from "./requests.js";
import AuthPerson from "../game/player/authPerson.js";

let game = null;

let player1 = null;

/*------------Logout Form---------------*/

function logoutButtonHandler(e) {
    e.preventDefault();
    player1 = null;
    if (game !== null) {
        quitButtonHandler(e);
    }

    const user = document.querySelector('.user');
    const login = document.querySelector('.login');

    user.style.visibility = 'hidden';
    login.style.visibility = 'visible';
}

function logoutButton() {
    const logout = document.querySelector('.user input.input-button');
    logout.addEventListener('click', (e) => { logoutButtonHandler(e) }, false);
}

/*------------Login Form---------------*/

function loginButtonHandler(e) {
    e.preventDefault();
    const username = document.querySelector('.login input[name="username"]').value;
    const password = document.querySelector('.login input[name="password"]').value;

    register(username, password, loginCallBack);
}

function loginCallBack(username, password, error) {
    if (username === null) {
        alert(error);
    } else {
        player1 = new AuthPerson(username, password);
        const user = document.querySelector('.user');
        const nameDisplay = document.querySelector('.user h2');
        const login = document.querySelector('.login');

        user.style.visibility = 'visible';
        login.style.visibility = 'hidden';
        nameDisplay.innerHTML = username;

    }
}

function loginButton() {
    const login = document.querySelector('.login input.input-button');
    login.addEventListener('click', (e) => { loginButtonHandler(e) }, false);
}

/*------------GAME MODE Radio Button---------------*/

function singleButtonHandler() {
    const gameMode = document.querySelectorAll('input[name="game-mode"]');
    const difficulty = document.getElementsByClassName("single-difficulty")[0];
    const turn = document.getElementsByClassName("turn")[0];

    if (gameMode[0].checked && !gameMode[1].checked) {
        difficulty.style.display = "block";
        turn.style.display = "block";
    } else if (gameMode[1].checked && !gameMode[0].checked) {
        difficulty.style.display = "none";
        turn.style.display = "none";
    }
}

function gameModeButton() {
    const gameMode = document.querySelectorAll('input[name="game-mode"]');
    gameMode[0].addEventListener('click', (e) => { singleButtonHandler(e) }, false);
    gameMode[1].addEventListener('click', (e) => { singleButtonHandler(e) }, false);
}

/*------------START Button---------------*/

function startButtonHandler(e) {
    e.preventDefault();
    const holesInput = document.getElementById('holes-input');
    const seedsInput = document.getElementById('seeds-input');
    const playerFirstTurn = document.querySelector('input[name="turn"]:checked');

    const gameMode = document.querySelector('input[name="game-mode"]:checked');
    const difficulty = document.querySelector('input[name="single-difficulty"]:checked');

    game = new Game(holesInput.value, seedsInput.value, playerFirstTurn.value);
    game.setPlayer1(player1);
    if (game.setUp(gameMode.value, difficulty.value)) {
        game.start();

        const result = document.querySelector(".result");
        const config = document.querySelector(".config");

        result.style.visibility = "visible";
        config.style.visibility = "hidden";
    }

}

function startButton() {
    const startButton = document.getElementsByClassName("start-button")[0];
    startButton.addEventListener('click', (e) => { startButtonHandler(e) }, false);
}

/*------------QUIT Button---------------*/

function quitButtonHandler(e) {
    e.preventDefault();
    game.leaveGame();

    const result = document.querySelector(".result");
    const config = document.querySelector(".config");

    result.style.visibility = "hidden";
    config.style.visibility = "visible";
}

function quitButton() {
    const quitButton = document.getElementsByClassName("quit-button")[0];
    quitButton.addEventListener('click', (e) => { quitButtonHandler(e) }, false);
}

/*------------End Game - Pop Up---------------*/

function popupQuitHandler(e) {
    e.preventDefault();
    game.leaveGame();

    const popup = document.querySelector(".popup")
    popup.style.display = "none";

    const result = document.querySelector(".result");
    const config = document.querySelector(".config");

    result.style.visibility = "hidden";
    config.style.visibility = "visible";
}

function popupQuit() {
    const popupQuit = document.querySelector(".popup-close")
    popupQuit.addEventListener('click', (e) => { popupQuitHandler(e) }, false);

}

function popupRestartHandler(e) {
    game.leaveGame();
    const popup = document.querySelector(".popup");
    popup.style.display = "none";

    startButtonHandler(e);
}

function popupRestart() {
    const popupRestart = document.querySelector(".popup .restart-button");
    popupRestart.addEventListener('click', (e) => { popupRestartHandler(e) }, false);
}

/*------------Instructions Button---------------*/

function goToInstructionsHandler(e) {

    const game = document.querySelector(".game");
    const leaderboard = document.querySelector(".leaderboard");
    const instructions = document.querySelector(".instructions");
    const form = document.querySelector(".config form");
    const pcboard = document.querySelector(".pcboard");

    const goToGame = document.querySelector(".go-to-game");
    const goToLeaderboard = document.querySelector(".go-to-leaderboard");
    const goToInstructions = document.querySelector(".go-to-instructions");
    const goToPcboard = document.querySelector(".go-to-pcboard");

    game.style.visibility = "hidden";
    leaderboard.style.visibility = "hidden";
    instructions.style.visibility = "visible";
    pcboard.style.visibility = "hidden";

    form.style.display = "none";
    goToLeaderboard.style.display = "block";
    goToGame.style.display = "block";
    goToInstructions.style.display = "none";
    goToPcboard.style.display = "block";
}

function goToInstructions() {
    const goToInstructions = document.querySelector(".go-to-instructions")
    goToInstructions.addEventListener('click', (e) => { goToInstructionsHandler(e) }, false);
}


/*------------Leader Board Button---------------*/

function goToLeaderBoardHandler(e) {
    ranking(goToleaderboardCallBack);

    const game = document.querySelector(".game");
    const leaderboard = document.querySelector(".leaderboard");
    const instructions = document.querySelector(".instructions");
    const form = document.querySelector(".config form");
    const pcboard = document.querySelector(".pcboard");

    const goToGame = document.querySelector(".go-to-game");
    const goToLeaderboard = document.querySelector(".go-to-leaderboard");
    const goToInstructions = document.querySelector(".go-to-instructions");
    const goToPcboard = document.querySelector(".go-to-pcboard");

    game.style.visibility = "hidden";
    leaderboard.style.visibility = "visible";
    instructions.style.visibility = "hidden";
    pcboard.style.visibility = "hidden";

    form.style.display = "none";
    goToLeaderboard.style.display = "none";
    goToGame.style.display = "block";
    goToInstructions.style.display = "block";
    goToPcboard.style.display = "block";
}

function goToleaderboardCallBack(list) {
    const listLines = JSON.parse(list).ranking;

    const leaderboardTable = document.querySelector(".leaderboard .leaderboard-table");

    while (leaderboardTable.firstChild) {
        if (leaderboardTable.lastChild.className === 'titles') {
            break;
        }
        leaderboardTable.removeChild(leaderboardTable.lastChild);
    }

    listLines.forEach(line => {

        let entry = document.createElement("div");
        entry.className = 'entries';

        let username = document.createElement("span");
        username.className = 'username';
        username.innerText = line.nick;

        let victories = document.createElement("span");
        victories.className = 'victories';
        victories.innerText = line.victories;

        let gamesPlayed = document.createElement("span");
        gamesPlayed.className = 'games-played';
        gamesPlayed.innerText = line.games;

        entry.appendChild(username);
        entry.appendChild(victories);
        entry.appendChild(gamesPlayed);

        leaderboardTable.appendChild(entry);
    });
}

function goToLeaderBoard() {
    const goToLeaderBoard = document.querySelector(".go-to-leaderboard")
    goToLeaderBoard.addEventListener('click', (e) => { goToLeaderBoardHandler(e) }, false);
}

function setPcBoard() {
    const board = JSON.parse(localStorage.getItem("board"));

    const pcboardTable = document.querySelector(".pcboard .pcboard-table");

    while (pcboardTable.firstChild) {
        if (pcboardTable.lastChild.className === 'titles') {
            break;
        }
        pcboardTable.removeChild(pcboardTable.lastChild);
    }

    if (board) {
        for (const [key, value] of Object.entries(board)) {

            let entry = document.createElement("div");
            entry.className = 'entries';

            let difficulty = document.createElement("span");
            difficulty.className = 'difficulty';
            difficulty.innerText = key;

            let victories = document.createElement("span");
            victories.className = 'victories';
            victories.innerText = value.victories;

            let gamesPlayed = document.createElement("span");
            gamesPlayed.className = 'games-played';
            gamesPlayed.innerText = value.games;

            entry.appendChild(difficulty);
            entry.appendChild(victories);
            entry.appendChild(gamesPlayed);

            pcboardTable.appendChild(entry);
        }
    }
}

function goToPcBoardHandler(e) {
    setPcBoard();

    const game = document.querySelector(".game");
    const leaderboard = document.querySelector(".leaderboard");
    const instructions = document.querySelector(".instructions");
    const form = document.querySelector(".config form");
    const pcboard = document.querySelector(".pcboard");

    const goToGame = document.querySelector(".go-to-game");
    const goToLeaderboard = document.querySelector(".go-to-leaderboard");
    const goToInstructions = document.querySelector(".go-to-instructions");
    const goToPcboard = document.querySelector(".go-to-pcboard");

    game.style.visibility = "hidden";
    leaderboard.style.visibility = "hidden";
    instructions.style.visibility = "hidden";
    pcboard.style.visibility = "visible";

    form.style.display = "none";
    goToLeaderboard.style.display = "block";
    goToGame.style.display = "block";
    goToInstructions.style.display = "block";
    goToPcboard.style.display = "none";
}

function goToPcBoard() {
    const goToPcBoard = document.querySelector(".go-to-pcboard")
    goToPcBoard.addEventListener('click', (e) => { goToPcBoardHandler(e) }, false);
}


/*------------Game Button---------------*/

function goToGameHandler(e) {

    const game = document.querySelector(".game");
    const leaderboard = document.querySelector(".leaderboard");
    const instructions = document.querySelector(".instructions");
    const form = document.querySelector(".config form");
    const pcboard = document.querySelector(".pcboard");

    const goToGame = document.querySelector(".go-to-game");
    const goToLeaderboard = document.querySelector(".go-to-leaderboard");
    const goToInstructions = document.querySelector(".go-to-instructions");
    const goToPcboard = document.querySelector(".go-to-pcboard");

    game.style.visibility = "visible";
    leaderboard.style.visibility = "hidden";
    instructions.style.visibility = "hidden";
    pcboard.style.visibility = "hidden";

    form.style.display = "flex";
    goToLeaderboard.style.display = "block";
    goToGame.style.display = "none";
    goToInstructions.style.display = "block";
    goToPcboard.style.display = "block";
}

function goToGame() {
    const goToGame = document.querySelector(".go-to-game")
    goToGame.addEventListener('click', (e) => { goToGameHandler(e) }, false);
}

/*------------Buttons Initialization---------------*/

function loadButtons() {
    startButton();
    quitButton();
    popupQuit();
    popupRestart();
    gameModeButton();
    goToInstructions();
    goToLeaderBoard();
    goToPcBoard();
    goToGame();
    loginButton();
    logoutButton();
}


window.onload = () => {
    console.log("loading");
    loadButtons();
}