class Display {
    constructor(document){
        this.document = document;
    }

    placeSeeds(seeds, htmlSeed){
        seeds.map((val) => {
            let seed = document.createElement("div");
            seed.className = 'seed';
            seed.style.top = val.positiony + "%";
            seed.style.left = val.positionx + "%"; 
            htmlSeed.appendChild(seed);
        })
    }
    
    placeHoles(holes, htmlHole, game){
        holes.map((val) => {
            let hole = document.createElement("div");
            hole.className='hole';
            
            let counter = document.createElement("div");
            counter.className='counter';
            counter.innerText = val.seeds.length;
            
            let seedPlace = document.createElement("div");
            seedPlace.className='seeds-place';
            
            seedPlace.onclick = ((side,holeIndex) => {
                return () => {
                    game.handleClick.call(game, side, holeIndex);
                }
            })(val.side, val.index);
            
            this.placeSeeds(val.seeds,seedPlace)
            
            hole.appendChild(counter);
            hole.appendChild(seedPlace);
            htmlHole.appendChild(hole);
        })
    }

    replaceHoles(holes, htmlHole, game){
        let oldHole = htmlHole.firstElementChild;
        holes.map((val) => {
            let newHole = document.createElement("div");
            newHole.className='hole';
            
            let counter = document.createElement("div");
            counter.className='counter';
            counter.innerText = val.seeds.length;
            
            let seedPlace = document.createElement("div");
            seedPlace.className='seeds-place';
            
            seedPlace.onclick = ((side,holeIndex) => {
                return () => {
                    game.handleClick.call(game, side, holeIndex);
                }
            })(val.side, val.index);

            this.placeSeeds(val.seeds,seedPlace);

            newHole.appendChild(counter);
            newHole.appendChild(seedPlace);
            htmlHole.replaceChild(newHole ,oldHole);
            oldHole = newHole.nextElementSibling;
        })
    }

    replaceStorage(storage, htmlHole, game){
        let counter = document.createElement("div");
        counter.className='counter';
        counter.innerText = storage.seeds.length;
        
        let seedPlace = document.createElement("div");
        seedPlace.className='seeds-place';
        
        this.placeSeeds(storage.seeds,seedPlace);
        

        let oldCounter = htmlHole.firstElementChild;
        console.log(oldCounter);
        htmlHole.replaceChild(counter,oldCounter);

        let oldSeedPlace = counter.nextElementSibling;
        htmlHole.replaceChild(seedPlace,oldSeedPlace);
    }
}

export default Display;

