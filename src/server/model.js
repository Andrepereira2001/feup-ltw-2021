const file = require('./file.js');
const crypto = require('crypto');
const game = require('./gameServer.js');

module.exports.get = (gameHash) => {
    return game.getGame(gameHash);
}

module.exports.register = (data, callback) => {
    if (data.nick === undefined || data.password === undefined) {
        callback(null, {
            status: 400,
            body: "Error: Invalid request"
        })
    }

    file.readCredentials((err, req) => {
        if (!err) {
            const password = crypto
                .createHash('sha256')
                .update(data.password)
                .digest('hex');

            if (req[data.nick] === undefined) {
                req[data.nick] = password
                file.writeCredentials(req, (err) => {});
                callback(null, {});
            } else if (req[data.nick] !== password) {
                callback(null, {
                    status: 401,
                    body: "Error: User registered with a different password"
                });
            } else {
                callback(null, {});
            }
        }
        else {
            callback(err);
        }
    })
}

module.exports.join = (data, callback) => {
    if (data.nick === undefined || data.password === undefined) {
        callback(null, {
            status: 400,
            error: "Invalid request"
        })
    }

    file.readCredentials((err, req) => {
        if (!err) {
            const password = crypto
                .createHash('sha256')
                .update(data.password)
                .digest('hex');

            if (req[data.nick] === password) {
                const group = data.group;
                const nHoles = data.size;
                const nSeeds = data.initial;

                const gameHash = game.joinGame(group,nHoles,nSeeds,data.nick);

                callback(null, { body: { "game": gameHash } });

            } else {
                callback(null, {
                    status: 401,
                    body: "Error: User registered with a different password"
                });
            }
        }else {
            callback(err);
        }
    })
}

module.exports.leave = (data, callback) => {
    if (data.nick === undefined || data.password === undefined) {
        callback(null, {
            status: 400,
            error: "Error: Invalid request"
        })
    }

    file.readCredentials((err, req) => {
        if (!err) {
            const password = crypto
                .createHash('sha256')
                .update(data.password)
                .digest('hex');

            if (req[data.nick] === password) {
                const gameHash = data.game;

                game.leaveGame(gameHash, data.nick);

                callback(null, {});

            } else {
                callback(null, {
                    status: 401,
                    body: "Error: User registered with a different password"
                });
            }
        }else {
            callback(err);
        }
    })
}

module.exports.notify = (data, callback) => {
    if (data.nick === undefined || data.password === undefined) {
        callback(null, {
            status: 400,
            error: "Error: Invalid request"
        })
    }

    file.readCredentials((err, req) => {
        if (!err) {
            const password = crypto
                .createHash('sha256')
                .update(data.password)
                .digest('hex');

            if (req[data.nick] === password) {
                const gameHash = data.game;
                const player = data.nick;
                const move = data.move;
                if(move < 0 || isNaN(move)){
                    callback({
                        status: 400,
                        body: "Error: Invalid move"
                    });
                }
                else {
                    game.notifyGame(gameHash,player, move, (err,res) => {
                        if(!err){
                            callback(null, { });
                        }
                        else {
                            callback(err);
                        }
                    });

                }

            } else {
                callback(null, {
                    status: 401,
                    body: "Error: User registered with a different password"
                });
            }
        }else {
            callback(err);
        }
    })
}

module.exports.ranking = (callback) => {
    file.readRanking((err, req) => {
        if (!err) {
            req.ranking.sort(function(a, b) {
                if (a.victories > b.victories) {
                    return -1;
                }
                if (a.victories < b.victories) {
                    return 1;
                }
                return 0;
            });

            const rank = req.ranking.slice(0, 10);
            callback(null, {
                status: 200,
                body: { ranking: rank }
            });
        }else {
            callback(err);
        }
    })
}