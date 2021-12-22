import Player from './player.js';

class Person extends Player {
    constructor(board, side) {
        super(board, side);
    }

    play(holeIndex) {
        if (holeIndex !== undefined) {
            console.log("person playing");
            return super.spreadSeeds(this.side, holeIndex);
        }
        return false;
    }


}


export default Person;