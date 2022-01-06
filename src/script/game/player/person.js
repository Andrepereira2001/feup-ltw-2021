import Player from './player.js';

class Person extends Player {
    constructor() {
        super();
        this.resetTimer();
    }

    resetTimer() {
        this.timer = 125
    }

    //returns true if the player can play again
    play(holeIndex) {
        if (holeIndex !== undefined && this.board.isValidMove(this.side, holeIndex)) {
            let capturedSeeds = this.board.storage1.seeds.length;
            capturedSeeds += this.board.storage2.seeds.length;

            const keepTurn = this.board.spreadSeeds(this.side, holeIndex);

            capturedSeeds = this.board.storage1.seeds.length + this.board.storage2.seeds.length - capturedSeeds;

            this.resetTimer();
            super.notify('play', capturedSeeds);
            super.notify('timer', this.timer);
            super.notify('turn', !keepTurn);

            return true;
        }

        this.timer -= 1;
        super.notify('timer', this.timer);

        return false;
    }

    saveResult() {}
}


export default Person;