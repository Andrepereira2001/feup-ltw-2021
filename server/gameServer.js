const crypto = require('crypto');
const updater = require('./updater.js');
const Game = require("./model/game.js");

const waitingGames = {};

const games = {};


const newGameHash = (group,nHoles,nSeeds) => {
    const date = Date.now().toString();

    const gameHash = crypto
                    .createHash('md5')
                    .update(group.toString())
                    .update(nHoles.toString())
                    .update(nSeeds.toString())
                    .update(date)
                    .digest('hex');
    return gameHash;
}
/*
games = {
    72 : {
        6 : {
            4 : i12g3123nabakjsdbkj1b231ash
        }
    }
}
*/
module.exports.joinGame = (group,nHoles,nSeeds,player) => {

    if(waitingGames[group] === undefined){
        waitingGames[group] = {};
    }
    if(waitingGames[group][nHoles] === undefined){
        waitingGames[group][nHoles] = {};
    }

    let hash = waitingGames[group][nHoles][nSeeds];
    if(hash === undefined){
        hash = newGameHash(group,nHoles,nSeeds);
        updater.createGame(hash);
        games[hash] = new Game(nHoles,nSeeds,player,group);
        waitingGames[group][nHoles][nSeeds] = hash;
    }
    else {
        waitingGames[group][nHoles][nSeeds] = undefined;
        games[hash].setPlayer2(player);

    }

    return hash;
}

module.exports.getGame = (hash) => {
    const message = games[hash].printBoard();
    return message;
}

module.exports.leaveGame = (hash, player) => {
    if(games[hash] !== undefined){
        const winner = games[hash].leaveGame(player);
        if (winner !== undefined){
            updater.updateGame(hash,{winner: winner})
        }

        if(waitingGames[games[hash].group][games[hash].board.nHoles][games[hash].board.nSeeds] !== undefined){
            waitingGames[games[hash].group][games[hash].board.nHoles][games[hash].board.nSeeds] = undefined;
        }

        delete games[hash];
        updater.forgetGame(hash);
    }
}

module.exports.notifyGame = (hash, player, move, callback) => {
    console.log(hash, player, move);
    if(games[hash] !== undefined && games[hash].verifyMove(player,move)){
        //DO MOVE
        games[hash].makeMove(player,move);
        const message = games[hash].printBoard();
        message.pit = move;
        updater.updateGame(hash,message);
        callback(null,{});
    }else {
        callback({
            status: 400,
            body: "error: Not your turn to play" 
        });
    }
}