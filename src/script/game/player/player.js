class Player {
    constructor(board, side) {
        this.board = board;
        this.side = side;
        this.observers = {};
    }

    play() {
        console.log("play mau");
    }

    turn() {
        console.log("turn mau");
    }

    addObserver(event, observer) {
        if (this.observers[event] === undefined) {
            this.observers[event] = [];
        }
        this.observers[event].push(observer);
    }

    notify(event, capturedSeeds) {
        this.observers[event].map((observer) => {
            observer.writeMessage(this.side, `Captured ${capturedSeeds} seeds.`)
        })
    }

}

export default Player;