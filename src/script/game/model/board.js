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
        this.storage2 = new Hole(-1,2,0);; 
    }

    getHole(side, holeIndex) {
        if(side == 1){
            return this.holes1[holeIndex];
        }
        return this.holes2[holeIndex];
    }

    nextHole(side, holeIndex) {
        if(side == 1){
            if(holeIndex + 1 == this.nHoles){
                return this.storage1;
            } else if ( holeIndex == this.nHoles){
                return this.holes2[this.nHoles - 1];
            } else {
                return this.holes1[holeIndex + 1];
            }
        } else {
            if(holeIndex == 0){
                return this.storage2;
            } else if ( holeIndex == -1){
                return this.holes1[0];
            } else {
                return this.holes2[holeIndex - 1];
            }
        }
    }
        
}

export default Board;
