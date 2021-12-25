import Player from './player.js';

class PC extends Player {
    constructor(board, side) {
        super(board, side);
    }

    play(holeIndex) {
        if (holeIndex === undefined) {
            let capturedSeeds = this.board.storage1.seeds.length;
            capturedSeeds += this.board.storage2.seeds.length;

            const keepTurn = super.spreadSeeds(this.side, Math.floor(Math.random() * (this.board.nHoles - 1)));

            capturedSeeds = this.board.storage1.seeds.length + this.board.storage2.seeds.length - capturedSeeds;
            super.notify('play',capturedSeeds);

            return keepTurn;
        }
        return true;
    }

}

export default PC;