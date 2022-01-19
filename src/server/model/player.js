const file = require('../file.js');

module.exports = class Player {
    constructor(player) {
        this.observers = {};
        this.resetTimer();
        this.name = player;
    }

    setBoard(board) {
        this.board = board;
    }

    setSide(side) {
        this.side = side;
    }

    resetTimer() {
        this.timer = 120;
    }

    //returns true if the player can play again
    play(holeIndex) {
        if (holeIndex !== undefined && this.board.isValidMove(this.side, holeIndex)) {

            const keepTurn = this.board.spreadSeeds(this.side, holeIndex);

            this.resetTimer();
            this.notify('timer', this.timer);
            this.notify('turn', !keepTurn);

            return true;
        }

        this.timer -= 1;
        this.notify('timer', this.timer);

        return false;
    }

    saveResult(win,ranking) {
        let found = false;
        ranking.forEach(element => {
            if(element.nick === this.name){
                found = true;
                element.games = element.games + 1;
                if(win){
                    element.victories = element.victories + 1;
                }
            }
        });

        if(!found){
            ranking.push({
                nick: this.name,
                games: 1,
                victories: win ? 1 : 0 
            })
        }
        
    }

    addObserver(event, observer) {
        if (this.observers[event] === undefined) {
            this.observers[event] = [];
        }
        this.observers[event].push(observer);
    }

    removeObservers() {
        this.observers = {};
    }

    notify(event, value) {
         if (event === "timer") {
            this.observers[event].map((observer) => {
                observer.timerInterrupt(value);
            })
        } else if (event === "turn") {
            this.observers[event].map((observer) => {
                observer.turnChange(value);
            })
        }
    }
}