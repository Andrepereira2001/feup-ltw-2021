const Seed = require("./seed.js");

module.exports = class Hole {
    //side -> indicates which player side (1 / 2)
    //index -> index in the array from left to right (0-3)
    //nSeeds -> number of actual seeds in the hole
    constructor(index, side, nSeeds) {
        this.index = index;
        this.side = side;
        this.seeds = new Array();

        for (let i = 0; i < nSeeds; i++) {
            this.seeds.push(new Seed());
        }
    }

    get nSeeds() {
        return this.seeds.length;
    }

    removeSeeds() {
        const seedsToRemove = this.seeds;
        this.seeds = [];
        return seedsToRemove;
    }

    addSeed(seed) {
        this.seeds.push(seed);
    }

    setHole(hole) {
        this.index = hole.index;
        this.side = hole.side;
        this.seeds = new Array();
        for (let i = 0; i < hole.seeds.length; i++) {
            this.seeds.push(hole.seeds[i].clone());
        }
    }

    clone() {
        let hole = new Hole();
        hole.setHole(this);
        return hole;
    }

}

