import Player from './player.js';

class Person extends Player {
    constructor() {
        super();
    }

    //returns true if the player can play again
    play(holeIndex) {
        if (holeIndex !== undefined) {
            let capturedSeeds = this.board.storage1.seeds.length;
            capturedSeeds += this.board.storage2.seeds.length;

            const keepTurn = this.board.spreadSeeds(this.side, holeIndex);

            capturedSeeds = this.board.storage1.seeds.length + this.board.storage2.seeds.length - capturedSeeds;

            super.notify('play', capturedSeeds);

            return keepTurn;
        }
        return true;
    }
}


export default Person;