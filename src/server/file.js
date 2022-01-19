const fs = require('fs');


module.exports.readRanking = (callback) => {
    fs.readFile('./server/data/ranking.json', function(err, data) {
        if (!err) {
            dados = JSON.parse(data.toString());
            callback(null, dados);
        }else {
            callback(null, {
                status: 500,
                body: "Error: Internal erro"
            })
        }
    });
}

module.exports.writeRanking = (data, callback) => {
    fs.writeFile('./server/data/ranking.json', JSON.stringify(data), function(err) {
        callback(err);
    });
}

module.exports.readCredentials = (callback) => {
    fs.readFile('./server/data/credentials.json', function(err, data) {
        if (!err) {
            dados = JSON.parse(data.toString());
            callback(null, dados);
        }
        else {
            callback(null, {
                status: 500,
                body: "Error: Internal erro"
            })
        }
    });
}

module.exports.writeCredentials = (data, callback) => {
    fs.writeFile('./server/data/credentials.json', JSON.stringify(data), function(err) {
        callback(err);
    });
}