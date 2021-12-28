import Player from './player.js';

class PC extends Player {
    constructor(difficulty) {
        super();
        this.difficulty = difficulty;
        this.interruptsToPlay = 1;
    }

    play(holeIndex) {
        if (holeIndex === undefined) {
            if (this.interruptsToPlay === 0) {
                this.interruptsToPlay = 1;
                let capturedSeeds = this.board.storage1.seeds.length;
                capturedSeeds += this.board.storage2.seeds.length;

                const keepTurn = this.board.spreadSeeds(this.side, this.getBestHole(this.difficulty));

                capturedSeeds = this.board.storage1.seeds.length + this.board.storage2.seeds.length - capturedSeeds;
                super.notify('play', capturedSeeds);

                return keepTurn;
            } else {
                this.interruptsToPlay = this.interruptsToPlay - 1;
            }
        }
        return true;
    }

    /* ----------------MINIMAX---------------- */

    getBestHole(depth) {
        let bestVal = -1000;
        let bestHole = -1;

        let holes;
        if (this.side === 2) {
            holes = this.board.holes2;
        } else {
            holes = this.board.holes1;
        }

        for (let i = 0; i < holes.length; i++) {

            // Check if cell is empty
            if (holes[i].nSeeds !== 0) {

                const copyBoard = this.board.clone();

                let holeVal = this.minimax(copyBoard, depth, true);

                if (holeVal > bestVal) {
                    bestVal = holeVal;
                    bestHole = i;
                }
            }
        }

        return bestHole;
    }

    evaluate(board) {
        return board.storage2.seeds.length - board.storage1.seeds.length;
    }

    gameEnded(board, nextPlayer) {
        let index = 0;
        while (board.holes1[index].seeds.length === 0 && nextPlayer === 1) {
            index++;
            if (index === board.holes1.length) {
                return true;
            }
        }

        index = 0;
        while (board.holes2[index].seeds.length === 0 && nextPlayer === 2) {
            index++;
            if (index === board.holes2.length) {
                return true;
            }
        }

        return false;
    }

    minimax(board, depth, isMax) {
        const side = isMax ? this.side : (this.side % 2) + 1;

        let score = this.evaluate(board);

        // If there are no more moves
        if (this.gameEnded(board, side) || depth === 0) {
            return score;
        }

        // If this maximizer's move
        if (isMax) {
            let best = -1000;
            let holes;

            if (side === 2) {
                holes = board.holes2;
            } else {
                holes = board.holes1;
            }
            // Traverse all cells
            for (let i = 0; i < holes.length; i++) {

                // Check if cell is empty
                if (holes[i].nSeeds !== 0) {

                    let copyBoard = board.clone(); //new Board(board.nHoles, board.nSeeds, board.holes1, board.holes2, board.storage1, board.storage2);
                    // Make the move
                    if (copyBoard.spreadSeeds(side, i)) {

                        // Call minimax recursively
                        // and choose the maximum value
                        best = Math.max(best, this.minimax(copyBoard, depth - 1, isMax));
                    } else {
                        best = Math.max(best, this.minimax(copyBoard, depth - 1, !isMax));
                    }
                }
            }
            return best;
        }

        // If this minimizer's move
        else {
            let best = 1000;
            let holes;

            if (side === 2) {
                holes = board.holes2;
            } else {
                holes = board.holes1;
            }

            // Traverse all cells
            for (let i = 0; i < holes.length; i++) {

                // Check if cell is empty
                if (holes[i].nSeeds !== 0) {

                    let copyBoard = board.clone();
                    // Make the move
                    if (copyBoard.spreadSeeds(side, i)) {
                        // Call minimax recursively and
                        // choose the minimum value
                        best = Math.min(best, this.minimax(copyBoard, depth - 1, isMax));
                    } else {
                        // Call minimax recursively and
                        // choose the minimum value
                        best = Math.min(best, this.minimax(copyBoard, depth - 1, !isMax));
                    }
                }
            }
            return best;
        }
    }
}

export default PC;