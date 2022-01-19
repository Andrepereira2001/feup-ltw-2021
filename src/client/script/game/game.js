import Board from "./model/board.js";
import Display from "./display.js";
import PC from "./player/pc.js";
import Person from "./player/person.js";

import { join, leave } from "../utils/requests.js";

class Game {
    constructor(nHoles = 6, nSeeds = 4, firstPlayer = 'first') {
        this.board = new Board(nHoles, nSeeds);
        this.display = new Display();
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
            this.players[2].addObserver('timer', this);
            this.players[2].addObserver('turn', this);
            this.players[2].setBoard(this.board);
            this.players[2].setSide(2);

            this.players[1].resetTimer();
            this.display.writeMessage(0, "Game has start!");
            this.display.turnDisplay(this.nextPlayer);

        } else if (gameMode === "multiplayer") {
            if (this.players[1] === undefined || this.players[1] === null) {
                alert("User must be logged in");
                return false;
            } else {
                join(this.players[1].username, this.players[1].password, this.board.nHoles, this.board.nSeeds,
                    (res, err) => {
                        this.setGameRef(res, err)
                    });

                this.players[2] = new Person();
                this.players[2].addObserver('play', this.display);
                this.players[2].addObserver('timer', this);
                this.players[2].addObserver('turn', this);
                this.players[2].setBoard(this.board);
                this.players[2].setSide(2);
                this.players[1].resetTimer();
                this.players[2].resetTimer();

                this.display.loadLoader();
            }
        }

        this.display.createBoard(this);

        return true;

    }

    setPlayer1(player) {
        if (player !== null) {
            this.players[1] = player;
            this.players[1].setBoard(this.board);
            this.players[1].setSide(1);
            this.players[1].addObserver('play', this.display);
            this.players[1].addObserver('timer', this);
            this.players[1].addObserver('turn', this);
        }
    }

    setGameRef(gameRef, error) {
        if (gameRef != null) {
            this.gameRef = gameRef;
            this.display.setupUpdate(this.players[1].username, gameRef, (state) => { this.updateMultiplayer(state) });
        } else {
            alert(error);
        }
    }

    /*------------Game Flow---------------*/
    start() {
        clearTimeout(this.loopingTimeout);

        this.loopingTimeout = setTimeout(() => { this.start() }, 1000);

        this.handleEvent();

    }

    handleEvent(side, holeIndex) {
        if (side === this.nextPlayer || side === undefined) {
            //verify if player should change

            this.players[this.nextPlayer].play(holeIndex, this.gameRef, this.display.notificationError);

            if (this.verifyEnd()) {

                this.endGame();
            }

            this.display.drawBoard(this);
        }
    }

    updateMultiplayer(state) {

        let holeIndex = state.pit;

        if (this.verifyWinner(state) && state.board === undefined) {
            return;
        }

        //paring complete
        if (holeIndex === undefined) {
            if (state.board.turn === this.players[1].username) {
                this.nextPlayer = 1
            } else {
                this.nextPlayer = 2;
            }
            this.removeWaiting();

            this.display.writeMessage(0, "Game has start!");
            this.display.turnDisplay(this.nextPlayer);
            // receive notification from other player
        } else if (this.nextPlayerRequest === 2) {
            this.handleEvent(2, (this.board.nHoles - holeIndex - 1));
        }

        //refresh the player that must play next
        if (state.board.turn === this.players[1].username) {
            this.nextPlayerRequest = 1;
        } else {
            this.nextPlayerRequest = 2;
        }
    }

    removeWaiting() {
        this.board = new Board(this.board.nHoles, this.board.nSeeds);
        this.display.createBoard(this);
        this.players[1].board = this.board;
        this.players[2].board = this.board;
        this.players[1].resetTimer();
        this.players[2].resetTimer();
        this.display.removeLoader();
    }

    /*------------End Game---------------*/
    verifyWinner(state) {
        const winner = state.winner;

        if (winner === null) {
            this.display.endGame('NO ONE APPEARED!', 0,0);
            this.leaveGame();
            this.gameRef = null;
            return true;
        } else if (winner !== undefined) {
            if (this.players[1].username === winner) {
                this.display.endGame('PLAYER 2 LEFT! YOU WIN!', this.board.storage1.seeds.length, this.board.storage2.seeds.length);
            } else if (this.players[1].username !== winner) {
                this.display.endGame('YOUR TIME RUN OUT!', this.board.storage1.seeds.length, this.board.storage2.seeds.length);
            }
            this.gameRef = null;
            this.leaveGame();
            return true;
        }

        return false;
    }

    verifyEnd() {
        let index = 0;
        while (this.board.holes1[index].seeds.length === 0 /*&& this.nextPlayer === 1*/ ) {
            index++;
            if (index === this.board.holes1.length) {
                return true;
            }
        }

        index = 0;
        while (this.board.holes2[index].seeds.length === 0 /*&& this.nextPlayer === 2*/ ) {
            index++;
            if (index === this.board.holes2.length) {
                return true;
            }
        }
        return false;
    }

    endGame() {
        clearTimeout(this.loopingTimeout);

        for (let i = 0; i < this.board.holes1.length; i++) {
            const seeds1 = this.board.holes1[i].removeSeeds();
            this.board.storage1.seeds = this.board.storage1.seeds.concat(seeds1);

            const seeds2 = this.board.holes2[i].removeSeeds();
            this.board.storage2.seeds = this.board.storage2.seeds.concat(seeds2);
        }

        this.players[2].saveResult();

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
    }

    leaveGame() {
        if (this.gameRef !== null) {
            leave(this.players[1].username, this.players[1].password, this.gameRef, this.display.notificationError);
        }

        clearTimeout(this.loopingTimeout);
        this.players[1].removeObservers();
        this.players[2].removeObservers();
        this.display.erase();
    }

    /*------------Observer Functions---------------*/

    timerInterrupt(time) {
        this.display.updateTimer(time);
        if (time === 0) {
            this.leaveGame();
            this.display.endGame('TIME OUT', this.board.storage1.seeds.length, this.board.storage2.seeds.length);
        }
    }

    turnChange(changeTurn) {
        if (changeTurn) {
            this.nextPlayer = (this.nextPlayer % 2) + 1;
        }

        this.display.turnDisplay(this.nextPlayer);
    }
}

export default Game;