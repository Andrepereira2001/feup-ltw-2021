//let responses = [];

// module.exports.remember = function(response) {
//     responses.push(response);
// }

// module.exports.forget = function(response) {
//     let pos = responses.findIndex((resp) => resp === response);
//     if (pos > -1)
//         responses.splice(pos, 1);
// }

// module.exports.update = function(message) {
//     for (let response of responses) {
//         response.write('data: ' + message + '\n\n');
//     }
// }


/*
responses = {
    hash1 : [responseP1, responseP2],
    hash2 : [responseP1, responseP2]  
}
*/
let responses = {}

module.exports.createGame = function(gameHash){
    if(responses[gameHash] === undefined){
        responses[gameHash] = [];
    }
}

module.exports.rememberGame = function(gameHash, response, callback) {
    if(responses[gameHash] === undefined){
        callback({
            status : 400,
            body : { 'error': "Invalid game reference"}
        })
    }
    else {
        responses[gameHash].push(response);
        callback(null, {})
    }
}

module.exports.forgetGame = function(gameHash, response) {
    if(responses[gameHash] !== undefined){
        delete responses[gameHash];
    }
}

module.exports.updateGame = function(gameHash, message) {

    if(responses[gameHash] !== undefined){
        for (let response of responses[gameHash]) {
            response.write('data:' + JSON.stringify(message) + '\n\n');
        }
    }
}