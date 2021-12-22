import Player from './player.js';

class PC extends Player {
    constructor(board, side) {
        super(board, side);
    }

    play() {
        console.log("pc played");
        return super.spreadSeeds(this.side, Math.floor(Math.random() * (this.board.nHoles - 1)));
    }

}

export default PC;