import Seed from './seed.js';
import Hole from './hole.js';

class Board {

    //holes -> number of gaming holes in each side
    //seeds -> number of seeds in each hole
    constructor(nHoles,nSeeds){
        this.nHoles = nHoles;
        this.nSeeds = nSeeds;
        this.holes1 = new Array();
        this.holes2 = new Array();
        for(let i = 0 ; i < nHoles; i++){
            this.holes1.push(new Hole(i,1,this.nSeeds));
            this.holes2.push(new Hole(i,2,this.nSeeds));
        }
        this.storage1 = new Hole(nHoles,1,0);
        this.storage2 = new Hole(nHoles,2,0);; 
    }

    // function addHole(params) {}
        
}

export default Board;
