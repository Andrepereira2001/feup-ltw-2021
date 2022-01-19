class Player {
    constructor() {
        this.observers = {};
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
        if (event === "play") {
            this.observers[event].map((observer) => {
                observer.writeMessage(this.side, `Captured ${value} seeds.`)
            })
        } else if (event === "timer") {
            this.observers[event].map((observer) => {
                observer.timerInterrupt(value);
            })
        } else if (event === "turn") {
            this.observers[event].map((observer) => {
                observer.turnChange(value);
            })
        }
    }

    setBoard(board) {
        this.board = board;
    }

    setSide(side) {
        this.side = side;
    }
}

export default Player;