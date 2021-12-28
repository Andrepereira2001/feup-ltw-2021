import Board from "./model/board.js";
import Display from "./display.js";
import PC from "./player/pc.js";
import Person from "./player/person.js";

class Game {
    constructor(nHoles = 6, nSeeds = 4, firstPlayer = 'first', gameMode, difficulty) {
        this.board = new Board(nHoles, nSeeds);
        this.display = new Display(document);
        this.players = [];
        this.loopingTimeout = null;

        (firstPlayer === 'first') ? this.nextPlayer = 1: this.nextPlayer = 2;


        if (gameMode === "singleplayer") {
            if (this.players[1] === undefined || this.players[1] === null) {
                this.setPlayer1(new Person())
            }
            this.players[2] = new PC(difficulty);
            this.players[2].addObserver('play', this.display);
            this.players[2].setBoard(this.board);
            this.players[2].setSide(2);

        } else {
            if (this.players[1] === undefined || this.players[1] === null) {
                //error login must be made
            }
            this.players[2] = new Person();
            this.players[2].addObserver('play', this.display);
            this.players[2].setBoard(this.board);
            this.players[2].setSide(2);
        }

        this.display.createBoard(this);

        this.display.writeMessage(0, "Game has start!")
        this.display.writeMessage(this.nextPlayer, `Player ${this.nextPlayer} turn.`)
    };

    setPlayer1(player) {
        if (player !== null) {
            this.players[1] = player;
            this.players[1].setBoard(this.board);
            this.players[1].setSide(1);
            this.players[1].addObserver('play', this.display);
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
            if (this.players[this.nextPlayer].play(holeIndex) === false) {
                this.nextPlayer = (this.nextPlayer % 2) + 1;
                this.display.writeMessage(this.nextPlayer, `Player ${this.nextPlayer} turn.`)
            }

            if (this.verifyEnd()) {
                this.endGame();
            }

            this.display.drawBoard(this);
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