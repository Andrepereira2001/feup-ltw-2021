"use strict";

let PORT = 8972;

let http = require('http');
let url = require('url');

let model = require('./server/model.js');
let updater = require('./server/updater.js');

let staticServer = require('./server/static.js');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};


const server = http.createServer(function(request, response) {
    const preq = url.parse(request.url, true);

    const pathname = preq.pathname;
    let answer = {};

    switch (request.method) {
        case 'GET':
            doGet(pathname, request, response, (error, answer = {}) => {
                if (error) {
                    response.writeHead(error.status, headers['plain']);
                    response.end(JSON.stringify(error.body));
                }
            });
            break;
        case 'POST':
            doPost(pathname, request, (error, answer = {}) => {
                
                if (!error) {
                    if (answer.status === undefined)
                        answer.status = 200;
                    if (answer.style === undefined)
                        answer.style = 'plain';

                    response.writeHead(answer.status, headers[answer.style]);

                    if (answer.style === 'plain') {
                        if (answer.body === undefined) {
                            response.end(JSON.stringify({}));
                        } else {
                            response.end(JSON.stringify(answer.body));
                        }
                    }
                } else {
                    console.log("erro",error);
                    response.writeHead(error.status, headers['plain']);
                    response.end(JSON.stringify(error.body));
                }

            });
            break;
        default:
            answer.status = 400;
    }

});

server.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
})


function doGet(pathname, request, response, callback) {
    let answer = {};

    switch (pathname) {
        case '/update':
            const params = url.parse(request.url, true).query;
            updater.rememberGame(params.game, response, (err, res) => {
                if (!err) {
                    response.writeHead(200, headers['sse']);
                    const message = model.get(params.game);
                    if (message !== undefined) {
                        updater.updateGame(params.game, message)
                    }
                    callback(null, res)
                } else {
                    callback(err);
                }
            });
            break;
        default:
            staticServer.call(request, response);
            break;
    }

    return answer;
}

function doPost(pathname, request, callback) {
    var answer = {};

    switch (pathname) {
        case '/register':
            let body = '';
            request.on('data', (chunk) => {
                    body += chunk;
                })
                .on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        model.register(data, (err, answer) => {
                            callback(err, answer);
                        });
                    } catch (err) {
                        answer.status = 400;
                        callback(err, answer);
                    } /* erros de JSON */
                })
                .on('error', (err) => { console.log(err.message); });
            break;

        case '/join':
            let joinBody = '';
            request.on('data', (chunk) => {
                    joinBody += chunk;
                })
                .on('end', () => {
                    try {
                        const data = JSON.parse(joinBody);
                        model.join(data, (err, answer) => {
                            callback(err, answer);
                        });
                    } catch (err) {
                        answer.status = 400;
                        callback(err, answer);
                    } /* erros de JSON */
                })
                .on('error', (err) => { console.log(err.message); });
            break;

        case '/leave':
            let leaveBody = '';
            request.on('data', (chunk) => {
                    leaveBody += chunk;
                })
                .on('end', () => {
                    try {
                        const data = JSON.parse(leaveBody);
                        model.leave(data, (err, answer) => {
                            callback(err, answer);
                        });
                    } catch (err) {
                        answer.status = 400;
                        callback(err, answer);
                    } /* erros de JSON */
                })
                .on('error', (err) => { console.log(err.message); });
            break;

        case '/notify':
            let notifyBody = '';
            request.on('data', (chunk) => {
                    notifyBody += chunk;
                })
                .on('end', () => {
                    try {
                        const data = JSON.parse(notifyBody);
                        model.notify(data, (err, answer) => {
                            callback(err, answer);
                        });
                    } catch (err) {
                        answer.status = 400;
                        callback(err, answer);
                    } /* erros de JSON */
                })
                .on('error', (err) => { console.log(err.message); });
            break;

        case '/ranking':
            request.on('data', () => {})
                .on('end', () => {
                    try {
                        model.ranking((err, answer) => {
                            callback(err, answer)
                        });
                    } catch (err) {
                        answer.status = 400;
                        callback(err, answer);
                    } /* erros de JSON */
                })
                .on('error', (err) => { console.log(err.message); });
            break;
        default:
            answer.status = 400;
            //callback(err, answer);
            break;
    }
}