import Board from "./model/board.js";
import Display from "./display.js"

class Game {
    constructor(nHoles = 6,nSeeds = 4,firstPlayer = 'first'){
        this.board = new Board(nHoles, nSeeds);
        this.display = new Display(document);

        (firstPlayer == 'first') ? this.nextPlayer = 1 : this.nextPlayer = 2;
        
        this.display.placeStorage(this.board.storage1,document.getElementsByClassName("hole big right")[0])
        this.display.placeStorage(this.board.storage2,document.getElementsByClassName("hole big left")[0] )
        this.display.placeHoles(this.board.holes1, document.getElementsByClassName("down-holes")[0], this);
        this.display.placeHoles(this.board.holes2, document.getElementsByClassName("up-holes")[0], this);

        this.display.writeMessage(0,"Game has start!")
        this.display.writeMessage(this.nextPlayer, `Player ${this.nextPlayer} turn.`)
    };

    erase(){
        this.display.writeMessage(0,"Cleaning board.")
        this.display.erase();
    }

    handleClick(side, holeIndex){
        if(this.nextPlayer === side){
            let capturedSeeds = this.board.storage1.seeds.length;
            capturedSeeds += this.board.storage2.seeds.length;
            //verify if player should change
            if (this.spreadSeeds(side,holeIndex) === false){
                this.nextPlayer = (this.nextPlayer % 2) + 1; 
            }

            this.display.writeMessage(side, `Captured ${this.board.storage1.seeds.length + this.board.storage2.seeds.length - capturedSeeds} seeds.`)
        }

        if(!this.verifyEnd()){
            this.display.writeMessage(this.nextPlayer, `Player ${this.nextPlayer} turn.`)
        }
        this.drawBoard();
    }

    verifyEnd(){
        let index = 0;
        while(this.board.holes1[index].seeds.length === 0 && this.nextPlayer === 1){
            index++;
            if(index === this.board.holes1.length){
                this.endGame();
                return true;
            }
        }

        index = 0;
        while(this.board.holes2[index].seeds.length === 0 && this.nextPlayer === 2){
            index++;
            if(index === this.board.holes2.length){
                this.endGame();
                return true;
            }
        }

        return false;
    }

    endGame(){
        for(let i = 0; i < this.board.holes1.length; i++){
            const seeds1 = this.board.holes1[i].removeSeeds();
            this.board.storage1.seeds = this.board.storage1.seeds.concat(seeds1);

            const seeds2 = this.board.holes2[i].removeSeeds();
            this.board.storage2.seeds = this.board.storage2.seeds.concat(seeds2);
        }

        if(this.board.storage1.seeds.length === this.board.storage2.seeds.length){
            this.display.endGame('DRAW',this.board.storage1.seeds.length,this.board.storage2.seeds.length);
            this.display.writeMessage(0, "Congratulations to both player you have draw.")
        }else if (this.board.storage1.seeds.length > this.board.storage2.seeds.length){
            this.display.endGame('VICTORY',this.board.storage1.seeds.length,this.board.storage2.seeds.length);
            this.display.writeMessage(0, "Congratulations Player 1 you win.")
        }
        else {
            this.display.endGame('DEFEAT',this.board.storage1.seeds.length,this.board.storage2.seeds.length);
            this.display.writeMessage(0, "Better luck next time Player 1.")
        }
    }
    

    drawBoard(){
        this.display.replaceHoles(this.board.holes1, document.getElementsByClassName("down-holes")[0], this);
        this.display.replaceHoles(this.board.holes2, document.getElementsByClassName("up-holes")[0], this);
        
        this.display.replaceStorage(this.board.storage1,document.getElementsByClassName("hole big right")[0]);
        this.display.replaceStorage(this.board.storage2,document.getElementsByClassName("hole big left")[0]);

        this.display.resultDisplay(this.board.storage1, document.querySelector(".player-1 .points"));
        this.display.resultDisplay(this.board.storage2, document.querySelector(".player-2 .points"));
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

export default Game;

