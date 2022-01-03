import { update } from "../utils/requests.js";

class Display {
    constructor(document) {
        this.document = document;
    }

    setupUpdate(username, gameRef, callback) {
        update(username, gameRef).onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
            callback(data);
        };
    }

    /*------------Board Display---------------*/
    createBoard(game) {
        this.placeStorage(game.board.storage1, document.getElementsByClassName("hole big right")[0]);
        this.placeStorage(game.board.storage2, document.getElementsByClassName("hole big left")[0]);

        this.placeHoles(game.board.holes1, document.getElementsByClassName("down-holes")[0]);
        this.placeHoles(game.board.holes2, document.getElementsByClassName("up-holes")[0]);

        this.addEventClickToHoles(game.board.holes1, document.getElementsByClassName("down-holes")[0], game);
        this.addEventClickToHoles(game.board.holes2, document.getElementsByClassName("up-holes")[0], game);
    }

    drawBoard(game) {
        this.replaceHoles(game.board.holes1, document.getElementsByClassName("down-holes")[0]);
        this.replaceHoles(game.board.holes2, document.getElementsByClassName("up-holes")[0]);

        this.replaceStorage(game.board.storage1, document.getElementsByClassName("hole big right")[0]);
        this.replaceStorage(game.board.storage2, document.getElementsByClassName("hole big left")[0]);

        this.resultDisplay(game.board.storage1, document.querySelector(".player-1 .points"));
        this.resultDisplay(game.board.storage2, document.querySelector(".player-2 .points"));

        this.addEventClickToHoles(game.board.holes1, document.getElementsByClassName("down-holes")[0], game);
        this.addEventClickToHoles(game.board.holes2, document.getElementsByClassName("up-holes")[0], game);
    }

    /*------------End Game Display---------------*/

    endGame(text, seedsPlayer1, seedsPlayer2) {
        const title = document.querySelector(".popup h2");
        title.innerHTML = text;

        const player1Score = document.querySelector(".popup .scores .value-1");
        const player2Score = document.querySelector(".popup .scores .value-2");

        player1Score.innerHTML = seedsPlayer1;
        player2Score.innerHTML = seedsPlayer2;

        const popup = this.document.querySelector(".popup");
        popup.style.display = "inline";
    }

    /*------------Seeds Display---------------*/

    placeSeeds(seeds, htmlSeed) {
        seeds.map((val) => {
            let seed = document.createElement("div");
            seed.className = 'seed';
            seed.style.top = val.positiony + "%";
            seed.style.left = val.positionx + "%";
            htmlSeed.appendChild(seed);
        })
    }

    /*------------Holes Display---------------*/

    placeHoles(holes, htmlHole) {
        this.eraseContent(htmlHole);

        holes.map((val) => {
            let hole = document.createElement("div");
            hole.className = 'hole';

            let counter = document.createElement("div");
            counter.className = 'counter';
            counter.innerText = val.seeds.length;

            let seedPlace = document.createElement("div");
            seedPlace.className = 'seeds-place';

            this.placeSeeds(val.seeds, seedPlace)

            hole.appendChild(counter);
            hole.appendChild(seedPlace);
            htmlHole.appendChild(hole);
        })
    }

    replaceHoles(holes, htmlHole) {
        let oldHole = htmlHole.firstElementChild;
        holes.map((val) => {
            let newHole = document.createElement("div");
            newHole.className = 'hole';

            let counter = document.createElement("div");
            counter.className = 'counter';
            counter.innerText = val.seeds.length;

            let seedPlace = document.createElement("div");
            seedPlace.className = 'seeds-place';

            this.placeSeeds(val.seeds, seedPlace);

            newHole.appendChild(counter);
            newHole.appendChild(seedPlace);
            htmlHole.replaceChild(newHole, oldHole);
            oldHole = newHole.nextElementSibling;
        })
    }

    addEventClickToHoles(holes, htmlHole, game) {
        let hole = htmlHole.firstElementChild;

        holes.map((val) => {
            hole.onclick = ((side, holeIndex) => {
                return () => {
                    game.handleEvent.call(game, side, holeIndex);
                }
            })(val.side, val.index);

            hole = hole.nextElementSibling;
        })
    }

    /*------------Storage Display---------------*/

    placeStorage(storage, htmlHole) {
        this.eraseContent(htmlHole)

        let counter = document.createElement("div");
        counter.className = 'counter';
        counter.innerText = storage.seeds.length;

        let seedPlace = document.createElement("div");
        seedPlace.className = 'seeds-place';

        this.placeSeeds(storage.seeds, seedPlace);

        htmlHole.appendChild(counter);
        htmlHole.appendChild(seedPlace);
    }

    replaceStorage(storage, htmlHole) {
        let counter = document.createElement("div");
        counter.className = 'counter';
        counter.innerText = storage.seeds.length;

        let seedPlace = document.createElement("div");
        seedPlace.className = 'seeds-place';

        this.placeSeeds(storage.seeds, seedPlace);


        let oldCounter = htmlHole.firstElementChild;
        htmlHole.replaceChild(counter, oldCounter);

        let oldSeedPlace = counter.nextElementSibling;
        htmlHole.replaceChild(seedPlace, oldSeedPlace);
    }

    resultDisplay(storage, htmlResult) {
        htmlResult.innerText = storage.seeds.length;
    }

    /*------------Erase Functions---------------*/

    eraseContent(container) {
        while (container.firstChild) {
            container.removeChild(container.lastChild);
        }
    }

    erasePoints(htmlResult) {
        htmlResult.innerText = 0;
    }

    erase() {
        this.eraseContent(document.getElementsByClassName("hole big right")[0]);
        this.eraseContent(document.getElementsByClassName("hole big left")[0]);
        this.eraseContent(document.getElementsByClassName("down-holes")[0]);
        this.eraseContent(document.getElementsByClassName("up-holes")[0]);

        this.erasePoints(document.querySelector(".player-1 .points"));
        this.erasePoints(document.querySelector(".player-2 .points"));

        this.eraseContent(document.querySelector(".messages"));
    }

    /*------------Messages---------------*/

    writeMessage(player, text) {

        const messages = document.querySelector(".game .messages");

        const paragraph = document.createElement("p");
        const node = document.createTextNode(text)
        paragraph.appendChild(node);


        switch (player) {
            case 0:
                paragraph.className = "center";
                break;
            case 1:
                paragraph.className = "start";
                break;
            case 2:
                paragraph.className = "end";
                break;
        }

        messages.appendChild(paragraph);

        messages.scrollTop = messages.scrollHeight;
    }
}

export default Display;