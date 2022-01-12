const fs = require('fs');


module.exports.readRanking = (callback) => {
    fs.readFile('./data/ranking.json', function(err, data) {
        if (!err) {
            dados = JSON.parse(data.toString());
            callback(null, dados);
        }
    });
}

module.exports.writeRanking = (data, callback) => {
    fs.writeFile('./data/ranking.json', JSON.stringify(data), function(err) {
        callback(err);
    });
}

module.exports.readCredentials = (callback) => {
    fs.readFile('./data/credentials.json', function(err, data) {
        if (!err) {
            dados = JSON.parse(data.toString());
            callback(null, dados);
        }
    });
}

module.exports.writeCredentials = (data, callback) => {
    fs.writeFile('./data/credentials.json', JSON.stringify(data), function(err) {
        callback(err);
    });
}