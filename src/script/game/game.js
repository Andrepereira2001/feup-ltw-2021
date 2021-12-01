import Board from "./model/board.js";
import Display from "./display.js"

class Game {
    constructor(nHoles,nSeeds,document){
        this.board = new Board(nHoles, nSeeds);
        this.display = new Display(document)

        this.display.placeHoles(this.board.holes1, document.getElementsByClassName("down-holes")[0], this);
        this.display.placeHoles(this.board.holes2, document.getElementsByClassName("up-holes")[0], this);
    };

    handleClick(side, holeIndex){
        this.spreadSeeds(side,holeIndex);

        this.display.replaceHoles(this.board.holes1, document.getElementsByClassName("down-holes")[0], this);
        this.display.replaceHoles(this.board.holes2, document.getElementsByClassName("up-holes")[0], this);
    }

    spreadSeeds(side,holeIndex){
        let hole = this.board.getHole(side,holeIndex);
        
        const seeds = hole.removeSeeds();
        
        while(seeds.length !== 0){
            hole = this.board.nextHole(hole.side, hole.index);
            
            hole.addSeed(seeds.shift());
        }
    }

}

window.onload = () => {
    const holesInput = document.getElementById('holes-input');
    const seedsInput = document.getElementById('seeds-input');
    new Game(holesInput.value,seedsInput.value, document);
}


