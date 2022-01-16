const Board = require("./board.js");
const Player = require("./player.js");
const file = require('../file.js');

// import { leave } from "../utils/requests.js";

module.exports = class Game {
    constructor(nHoles, nSeeds, player,group,hash,timeout ) {
        this.group = group;
        this.board = new Board(nHoles, nSeeds);
        this.players = [];
        this.nextPlayer = 1;
        this.gameEnd = false;
        this.hash = hash;
        this.timeoutFunc = timeout;

        this.loopingTimeout = null;
        this.gameRef = null;

        this.players[1] = new Player(player);
        this.players[1].addObserver('timer', this);
        this.players[1].addObserver('turn', this);
        this.players[1].setBoard(this.board);
        this.players[1].setSide(1);
        this.players[1].resetTimer();
    };

    setPlayer2(player) {
        if (player !== null) {
            this.players[2] = new Player(player);
            this.players[2].addObserver('timer', this);
            this.players[2].addObserver('turn', this);
            this.players[2].setBoard(this.board);
            this.players[2].setSide(2);
            this.players[2].resetTimer();   

            this.players[1].resetTimer();
        }
    }

    leaveGame(player){
        clearTimeout(this.loopingTimeout);
        if(this.players[1].name === player){
            if(this.players[2] === undefined){
                return null;
            }
            else {
                return this.players[2].name;
            }
        } else if(this.players[2].name === player){
            return this.players[1].name;
        }
    }

    printBoard(){
        if(this.players.length !== 3) return;
        
        const state = {
            board: { 
                sides: {
                    [this.players[1].name]: {
                        pits : this.board.printHoles1(),
                        store: this.board.storage1.seeds.length
                    },
                    [this.players[2].name]: { 
                        pits: this.board.printHoles2(),
                        store: this.board.storage2.seeds.length
                    }
                },
                turn : this.players[this.nextPlayer].name
            },
            stores: {
                [this.players[1].name] : this.board.storage1.seeds.length,
                [this.players[2].name] : this.board.storage2.seeds.length
            }
        }

        if(this.gameEnd) {
            if(this.board.storage1.seeds.length > this.board.storage2.seeds.length){
                state.winner = this.players[1].name;
            }else if(this.board.storage1.seeds.length < this.board.storage2.seeds.length){
                state.winner = this.players[2].name;
            }
            else {
                state.winner = null
            }
        }
        return state
    }

    /*------------Game Flow---------------*/
    start() {
        clearTimeout(this.loopingTimeout);

        this.loopingTimeout = setTimeout(() => { this.start() }, 1000);

        this.makeMove();

    }

    makeMove(player, holeIndex) {
        if (player === this.players[this.nextPlayer].name || player === undefined) {
            //verify if player should change

            this.players[this.nextPlayer].play(holeIndex);

            if (this.verifyEnd()) {

                this.endGame();
            }
        }
    }

    verifyMove(player,move){
        let ret = this.players[this.nextPlayer].name === player;
        ret = ret && this.board.isValidMove(this.nextPlayer,move);
        ret = ret && this.players[2] !== undefined
        return ret;
    }

    /*------------End Game---------------*/

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

        this.gameEnd = true;

        for (let i = 0; i < this.board.holes1.length; i++) {
            const seeds1 = this.board.holes1[i].removeSeeds();
            this.board.storage1.seeds = this.board.storage1.seeds.concat(seeds1);

            const seeds2 = this.board.holes2[i].removeSeeds();
            this.board.storage2.seeds = this.board.storage2.seeds.concat(seeds2);
        }


        if(this.gameEnd) {
            file.readRanking((err,res) => {
                if(this.board.storage1.seeds.length > this.board.storage2.seeds.length){
                    this.players[1].saveResult(true,res.ranking);
                    this.players[2].saveResult(false,res.ranking);
                }else if(this.board.storage1.seeds.length < this.board.storage2.seeds.length){
                    this.players[1].saveResult(false,res.ranking);            
                    this.players[2].saveResult(true);
                }
                else {
                    this.players[1].saveResult(false,res.ranking);
                    this.players[2].saveResult(false,res.ranking);
                }

                file.writeRanking(res,() => {
                });
            })
            
        }
    }

    /*------------Observer Functions---------------*/

    timerInterrupt(time) {
        if (time === 0) {
            clearTimeout(this.loopingTimeout);
            this.timeoutFunc(this.hash,this.players[this.nextPlayer].name)
        }
    }

    turnChange(changeTurn) {
        if (changeTurn) {
            this.nextPlayer = (this.nextPlayer % 2) + 1;
        }
    }
}
