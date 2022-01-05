import { update } from "../utils/requests.js";

class Display {
    constructor() {
        this.eventSource = null;
    }

    setupUpdate(username, gameRef, callback) {
        this.eventSource = update(username, gameRef);
        this.eventSource.onmessage = (e) => {
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
        // this.addEventClickToHoles(game.board.holes2, document.getElementsByClassName("up-holes")[0], game);

        if (game.nextPlayer === 1) {
            this.highlightHolesToPlay();
        }
    }

    drawBoard(game) {
        this.replaceHoles(game.board.holes1, document.getElementsByClassName("down-holes")[0]);
        this.replaceHoles(game.board.holes2, document.getElementsByClassName("up-holes")[0]);

        this.replaceStorage(game.board.storage1, document.getElementsByClassName("hole big right")[0]);
        this.replaceStorage(game.board.storage2, document.getElementsByClassName("hole big left")[0]);

        this.resultDisplay(game.board.storage1, document.querySelector(".player-1 .points"));
        this.resultDisplay(game.board.storage2, document.querySelector(".player-2 .points"));

        this.addEventClickToHoles(game.board.holes1, document.getElementsByClassName("down-holes")[0], game);

        if (game.nextPlayer === 1) {
            this.highlightHolesToPlay();
        }
        // this.addEventClickToHoles(game.board.holes2, document.getElementsByClassName("up-holes")[0], game);
    }

    turnDisplay(nextPlayer) {
        if (nextPlayer === 1) {
            this.writeMessage(nextPlayer, `Your turn!`);
        } else {
            this.writeMessage(nextPlayer, `Opponent turn!`);
        }
    }

    /*------------End Game Display---------------*/

    endGame(text, seedsPlayer1, seedsPlayer2) {
        const title = document.querySelector(".popup h2");
        title.innerHTML = text;

        const player1Score = document.querySelector(".popup .scores .value-1");
        const player2Score = document.querySelector(".popup .scores .value-2");

        player1Score.innerHTML = seedsPlayer1;
        player2Score.innerHTML = seedsPlayer2;

        const popup = document.querySelector(".popup");
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

    highlightHolesToPlay() {
        let downHoles = document.querySelectorAll(".gaming-holes .down-holes .hole .seeds-place");

        downHoles.forEach((val) => {
            val.style.borderColor = "#FFFFFF";
            val.style.cursor = "pointer";
            val.classList.add("playing-turn");
        });
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

    /*------------Loader Display---------------*/

    loadLoader() {
        const holes = document.querySelectorAll(".game .board .hole.big, .game .board .gaming-holes");
        const loader = document.querySelector(".game .board .loader");

        holes.forEach((val) => {
            val.style.display = "none";
        })
        loader.style.display = "flex";
    }

    removeLoader() {
        const holes = document.querySelectorAll(".game .board .hole.big, .game .board .gaming-holes");
        const loader = document.querySelector(".game .board .loader");

        holes.forEach((val) => {
            val.style.display = "flex";
        })
        loader.style.display = "none";
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

        this.removeLoader()

        if (this.eventSource !== null) {
            this.eventSource.close()
            this.eventSource = null;
        }
    }

    /*------------Messages---------------*/

    updateTimer(time) {
        const timer = document.querySelector(".result .timer span")
        timer.innerText = time;
    }

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

    notificationError(error) {
        if (error) {
            alert(error);
        }
    }
}


// window.requestAnimFrame = function() {
//     return (
//         window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         window.oRequestAnimationFrame ||
//         window.msRequestAnimationFrame ||
//         function( /* function */ callback) {
//             window.setTimeout(callback, 1000 / 60);
//         }
//     );
// }();

// var canvas = document.getElementById('canvas');

// var context = canvas.getContext('2d');

// var W = window.innerWidth,
//     H = window.innerHeight;
// canvas.width = W;
// canvas.height = 2000;

// var particle;

// function Particle(radius, y, x) {
//     this.radius = radius;
//     this.x = x;
//     this.y = y;

//     this.move = function() {
//         var dateDev = new Date();
//         var unite = dateDev.getSeconds() + (dateDev.getMilliseconds() / 1000);
//         var diviseur = 30;
//         var texte = unite;
//         context.beginPath();
//         context.globalCompositeOperation = 'source-over';
//         context.font = this.radius + "px Arial";
//         context.textAlign = 'center';
//         context.textBaseline = 'middle';
//         context.fillStyle = 'white';
//         context.fillText(Math.floor(texte), this.x, this.y);
//         context.globalCompositeOperation = 'destination-over';

//         context.fill();
//         context.fillStyle = "#3498db";
//         context.strokeStyle = "#3498db";
//         context.arc(this.x, this.y, this.radius, (Math.PI * 1.5), (Math.PI) * (unite / diviseur) + (Math.PI * 1.5), true);
//         context.lineTo(this.x, this.y);
//         context.fill();
//         context.closePath();
//     };
// };

// particle = new Particle(75, 90, 90);

// function animate() {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     particle.move();
//     requestAnimFrame(animate);
// }

// animate();

export default Display;