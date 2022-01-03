import Board from "./model/board.js";
import Display from "./display.js";
import PC from "./player/pc.js";
import Person from "./player/person.js";

import { join } from "../utils/requests.js";

class Game {
    constructor(nHoles = 6, nSeeds = 4, firstPlayer = 'first') {
        this.board = new Board(nHoles, nSeeds);
        this.display = new Display(document);
        this.players = [];
        this.loopingTimeout = null;
        this.gameRef = null;

        this.nextPlayerRequest = null;

        (firstPlayer === 'first') ? this.nextPlayer = 1: this.nextPlayer = 2;
    };

    setUp(gameMode, difficulty) {
        if (gameMode === "singleplayer") {
            if (this.players[1] === undefined || this.players[1] === null) {
                this.setPlayer1(new Person());
            }
            this.players[2] = new PC(difficulty);
            this.players[2].addObserver('play', this.display);
            this.players[2].setBoard(this.board);
            this.players[2].setSide(2);

        } else if (gameMode === "multiplayer") {
            if (this.players[1] === undefined || this.players[1] === null) {
                alert("User must be logged in");
                return;
            } else {
                join(this.players[1].username, this.players[1].password, this.board.nHoles, this.board.nSeeds,
                    (res, err) => {
                        this.setGameRef(res, err)
                    });

                this.players[2] = new Person();
                this.players[2].addObserver('play', this.display);
                this.players[2].setBoard(this.board);
                this.players[2].setSide(2);
            }
        }

        this.display.createBoard(this);

    }

    setPlayer1(player) {
        if (player !== null) {
            this.players[1] = player;
            this.players[1].setBoard(this.board);
            this.players[1].setSide(1);
            this.players[1].addObserver('play', this.display);
        }
    }

    setGameRef(gameRef, error) {
        if (gameRef != null) {
            this.gameRef = gameRef;
            console.log(this);
            this.display.setupUpdate(this.players[1].username, gameRef, (state) => { this.updateMultiplayer(state) });
        } else {
            alert(error);
        }
    }

    /*------------Game Flow---------------*/
    start() {
        this.handleEvent();

        this.loopingTimeout = setTimeout(() => { this.start() }, 1000);
    }

    handleEvent(side, holeIndex) {
        if (side === this.nextPlayer || side === undefined) {
            //verify if player should change
            if (this.players[this.nextPlayer].play(holeIndex, this.gameRef) === false) {
                this.nextPlayer = (this.nextPlayer % 2) + 1;
                this.display.writeMessage(this.nextPlayer, `Player ${this.nextPlayer} turn.`);
            }

            if (this.verifyEnd()) {
                this.endGame();
            }

            this.display.drawBoard(this);
        }
    }

    updateMultiplayer(state) {

        let holeIndex = state.pit;

        //paring complete
        if (holeIndex === undefined) {
            if (state.board.turn === this.players[1].username) {
                this.nextPlayer = 1
            } else {
                this.nextPlayer = 2;
            }
            this.display.writeMessage(0, "Game has start!");
            this.display.writeMessage(this.nextPlayer, `Player ${this.nextPlayer} turn.`);
        // receive notification from other player
        } else if (this.nextPlayerRequest === 2) {
            this.handleEvent(2 , (this.board.nHoles - holeIndex - 1));
        }

        //refresh the player that must play next
        if (state.board.turn === this.players[1].username) {
            this.nextPlayerRequest = 1;
        } else {
            this.nextPlayerRequest = 2;
        }
    }


    /*------------End Game---------------*/

    verifyEnd() {
        let index = 0;
        while (this.board.holes1[index].seeds.length === 0 && this.nextPlayer === 1) {
            index++;
            if (index === this.board.holes1.length) {
                return true;
            }
        }

        index = 0;
        while (this.board.holes2[index].seeds.length === 0 && this.nextPlayer === 2) {
            index++;
            if (index === this.board.holes2.length) {
                return true;
            }
        }

        return false;
    }

    endGame() {
        for (let i = 0; i < this.board.holes1.length; i++) {
            const seeds1 = this.board.holes1[i].removeSeeds();
            this.board.storage1.seeds = this.board.storage1.seeds.concat(seeds1);

            const seeds2 = this.board.holes2[i].removeSeeds();
            this.board.storage2.seeds = this.board.storage2.seeds.concat(seeds2);
        }

        if (this.board.storage1.seeds.length === this.board.storage2.seeds.length) {
            this.display.endGame('DRAW', this.board.storage1.seeds.length, this.board.storage2.seeds.length);
            this.display.writeMessage(0, "Congratulations to both player you have draw.")
        } else if (this.board.storage1.seeds.length > this.board.storage2.seeds.length) {
            this.display.endGame('VICTORY', this.board.storage1.seeds.length, this.board.storage2.seeds.length);
            this.display.writeMessage(0, "Congratulations Player 1 you win.")
        } else {
            this.display.endGame('DEFEAT', this.board.storage1.seeds.length, this.board.storage2.seeds.length);
            this.display.writeMessage(0, "Better luck next time Player 1.")
        }
        clearTimeout(this.loopingTimeout);
    }

    leaveGame() {
        clearTimeout(this.loopingTimeout);
        this.display.erase();
    }

}

export default Game;