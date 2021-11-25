import Seed from './seed.js';
import Hole from './hole.js';
import Board from './board.js';

window.onload = () => {
    const holesInput = document.getElementById('holes-input');
    const seedsInput = document.getElementById('seeds-input');
    const board = new Board(holesInput.value,seedsInput.value);

    let upHole = document.getElementsByClassName("up-holes")[0];
    board.holes1.map((val) => {
        let hole = document.createElement("div");
        hole.className='hole';

        let counter = document.createElement("div");
        counter.className='counter'
        counter.innerText = val.seeds.length;

        let seedPlace = document.createElement("div");
        seedPlace.className='seeds-place';

        hole.appendChild(counter);
        hole.appendChild(seedPlace);
        upHole.appendChild(hole);
        
    })

    let downHole = document.getElementsByClassName("down-holes")[0];
    board.holes2.map((val) => {
        let hole = document.createElement("div");
        hole.className='hole';

        downHole.appendChild(hole);
    })
}
