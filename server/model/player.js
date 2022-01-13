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
        this.timer = 125;
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

    saveResult() {}

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
                console.log("Said hello");
                observer.turnChange(value);
            })
        }
    }
}