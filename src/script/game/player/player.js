class Player {
    constructor() {
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
        if(event === "play"){
            this.observers[event].map((observer) => {
                observer.writeMessage(this.side, `Captured ${capturedSeeds} seeds.`)
            })   
        }else if(event === "timer"){
            this.observers[event].map((observer) => {
                observer.timerInterrupt(this.timer);
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