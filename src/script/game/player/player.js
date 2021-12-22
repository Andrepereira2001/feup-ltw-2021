class Player {
    constructor(board, side) {
        this.board = board;
        this.side = side;
    }

    play(holeIndex) {
        console.log("play mau");
    }

    turn() {
        console.log("turn mau");
    }


    //returns true if the player can play again
    spreadSeeds(side, holeIndex) {
        console.log("side:", side, "-", holeIndex);
        let hole = this.board.getHole(side, holeIndex);

        if (hole.seeds.length === 0) {
            return true;
        }

        const seeds = hole.removeSeeds();

        while (seeds.length !== 0) {
            hole = this.board.nextHole(hole.side, hole.index);

            //verify if seed can be placed in storage
            if (this.board.isStorage(hole) && hole.side !== side) {
                hole = this.board.nextHole(hole.side, hole.index);
            }

            hole.addSeed(seeds.shift());
        }

        return this.board.isStorage(hole) ? true : this.collectIfEmpty(hole, side);
    }

    collectIfEmpty(hole, side) {
        if (hole.side === side && hole.seeds.length === 1) {
            if (side === 1) {
                const oppHole = this.board.holes2[hole.index];
                if (oppHole.seeds.length !== 0) {
                    const seeds = oppHole.removeSeeds();
                    const seeds2 = hole.removeSeeds();
                    this.board.storage1.seeds = this.board.storage1.seeds.concat(seeds, seeds2);
                }
            } else {
                const oppHole = this.board.holes1[hole.index];
                if (oppHole.seeds.length !== 0) {
                    const seeds = oppHole.removeSeeds();
                    const seeds2 = hole.removeSeeds();
                    this.board.storage2.seeds = this.board.storage2.seeds.concat(seeds, seeds2);
                }
            }
        }
        return false;
    }

}

export default Player;