import Board from "./model/board.js";
import Display from "./display.js"

class Game {
    constructor(nHoles,nSeeds,firstPlayer,document){
        this.board = new Board(nHoles, nSeeds);
        this.display = new Display(document);

        (firstPlayer == 'first') ? this.nextPlayer = 1 : this.nextPlayer = 2;

        this.display.placeHoles(this.board.holes1, document.getElementsByClassName("down-holes")[0], this);
        this.display.placeHoles(this.board.holes2, document.getElementsByClassName("up-holes")[0], this);
    };

    handleClick(side, holeIndex){
        console.log(`player: ${this.nextPlayer}   ---   side:${side}`);

        if(this.nextPlayer === side){

            //verify if player should change
            if (this.spreadSeeds(side,holeIndex) === false){
                console.log("changing side");
                this.nextPlayer = (this.nextPlayer % 2) + 1; 
            }
        }

        this.drawBoard();
    }
    

    drawBoard(){
        this.display.replaceHoles(this.board.holes1, document.getElementsByClassName("down-holes")[0], this);
        this.display.replaceHoles(this.board.holes2, document.getElementsByClassName("up-holes")[0], this);
        
        this.display.replaceStorage(this.board.storage1,document.getElementsByClassName("hole big right")[0], this);
        this.display.replaceStorage(this.board.storage2,document.getElementsByClassName("hole big left")[0], this);
    }

    //returns true if the player can play again
    spreadSeeds(side,holeIndex){
        let hole = this.board.getHole(side,holeIndex);
        
        const seeds = hole.removeSeeds();
        
        while(seeds.length !== 0){
            hole = this.board.nextHole(hole.side, hole.index);

            //verify if seed can be placed in storage
            if(this.board.isStorage(hole) && hole.side !== side){
                hole = this.board.nextHole(hole.side, hole.index);
            } 
            
            hole.addSeed(seeds.shift());
        }

        return this.board.isStorage(hole) ? true : this.collectIfEmpty(hole,side);
    }

    collectIfEmpty(hole,side){
        if(hole.side === side && hole.seeds.length === 1){
            if(side === 1){
                const oppHole = this.board.holes2[hole.index];
                if(oppHole.seeds.length !== 0){                    
                    const seeds = oppHole.removeSeeds();
                    const seeds2 = hole.removeSeeds();
                    this.board.storage1.seeds = this.board.storage1.seeds.concat(seeds,seeds2);
                }
            }
            else {
                const oppHole = this.board.holes1[hole.index];
                if(oppHole.seeds.length !== 0){
                    const seeds = oppHole.removeSeeds();
                    const seeds2 = hole.removeSeeds();
                    this.board.storage2.seeds = this.board.storage2.seeds.concat(seeds,seeds2);
                }
            }
        }
        console.log(this.board);
        return false;
    }
}

window.onload = () => {
    const holesInput = document.getElementById('holes-input');
    const seedsInput = document.getElementById('seeds-input');
    const playerFirstTurn = document.querySelector('input[name="turn"]:checked');

    new Game(holesInput.value,seedsInput.value, playerFirstTurn.value, document);
}


