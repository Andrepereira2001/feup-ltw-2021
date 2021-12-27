import Hole from './hole.js';

class Board {

    //holes -> number of gaming holes in each side
    //seeds -> number of seeds in each hole
    constructor(nHoles, nSeeds) {
        this.nHoles = nHoles;
        this.nSeeds = nSeeds;
        this.holes1 = new Array();
        this.holes2 = new Array();
        for (let i = 0; i < nHoles; i++) {
            this.holes1.push(new Hole(i, 1, this.nSeeds));
            this.holes2.push(new Hole(i, 2, this.nSeeds));
        }
        this.storage1 = new Hole(nHoles, 1, 0);
        this.storage2 = new Hole(-1, 2, 0);
    }

    // constructor(nHoles, nSeeds, holes1, holes2, storage1, storage2) {
    //     this.nHoles = nHoles;
    //     this.nSeeds = nSeeds;
    //     this.holes1 = holes1;
    //     this.holes2 = holes2;
    //     this.storage1 = storage1;
    //     this.storage2 = storage2;
    // }

    getHole(side, holeIndex) {
        if (side == 1) {
            return this.holes1[holeIndex];
        }
        return this.holes2[holeIndex];
    }

    nextHole(side, holeIndex) {
        if (side == 1) {
            if (holeIndex + 1 == this.nHoles) {
                return this.storage1;
            } else if (holeIndex == this.nHoles) {
                return this.holes2[this.nHoles - 1];
            } else {
                return this.holes1[holeIndex + 1];
            }
        } else {
            if (holeIndex == 0) {
                return this.storage2;
            } else if (holeIndex == -1) {
                return this.holes1[0];
            } else {
                return this.holes2[holeIndex - 1];
            }
        }
    }

    isStorage(hole) {
        return hole.index === -1 || hole.index === this.nHoles;
    }

    setBoard(board) {
        this.nHoles = board.nHoles;
        this.nSeeds = board.nSeeds;
        for (let i = 0; i < board.holes1.length; i++) {
            this.holes1.push(board.holes1[i].clone());
            this.holes2.push(board.holes2[i].clone());
        }
        this.storage1 = board.storage1.clone();
        this.storage2 = board.storage2.clone();
    }

    clone() {
        let board = new Board()
        board.setBoard(this);
        return board;
    }

    //returns true if the player can play again
    spreadSeeds(side, holeIndex) {
        let hole = this.getHole(side, holeIndex);

        if (hole.seeds.length === 0) {
            return true;
        }

        const seeds = hole.removeSeeds();

        while (seeds.length !== 0) {
            hole = this.nextHole(hole.side, hole.index);

            //verify if seed can be placed in storage
            if (this.isStorage(hole) && hole.side !== side) {
                hole = this.nextHole(hole.side, hole.index);
            }

            hole.addSeed(seeds.shift());
        }

        return this.isStorage(hole) ? true : this.collectIfEmpty(hole, side);
    }

    collectIfEmpty(hole, side) {
        if (hole.side === side && hole.seeds.length === 1) {
            if (side === 1) {
                const oppHole = this.holes2[hole.index];
                if (oppHole.seeds.length !== 0) {
                    const seeds = oppHole.removeSeeds();
                    const seeds2 = hole.removeSeeds();
                    this.storage1.seeds = this.storage1.seeds.concat(seeds, seeds2);
                }
            } else {
                const oppHole = this.holes1[hole.index];
                if (oppHole.seeds.length !== 0) {
                    const seeds = oppHole.removeSeeds();
                    const seeds2 = hole.removeSeeds();
                    this.storage2.seeds = this.storage2.seeds.concat(seeds, seeds2);
                }
            }
        }
        return false;
    }

}

export default Board;