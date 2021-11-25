import Seed from './seed.js';

class Hole {
    //side -> indicates which player side (1 / 2)
    //index -> index in the array from left to right (0-3)
    //nSeeds -> number of actual seeds in the hole
    constructor(index,side, nSeeds){
        this.index = index;
        this.side = side;
        this.seeds = new Array();

        for(let i = 0 ; i < nSeeds; i++){
            this.seeds.push(new Seed());
        }
    }

    get nSeeds() {
        return this.seeds.length();
    }
     
}


export default Hole;
