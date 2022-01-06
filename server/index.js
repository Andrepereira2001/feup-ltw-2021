"use strict";

let PORT = 8000;

let http = require('http');
let url = require('url');

let model = require('./model.js');
let updater = require('./updater.js');

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
            answer = doGet(pathname, request, response);
            break;
        case 'POST':
            doPost(pathname, request, (error, answer = {}) => {
                console.log("callback", answer);
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

            });
            break;
        default:
            answer.status = 400;
    }


    // if (answer.status === undefined)
    //     answer.status = 200;
    // if (answer.style === undefined)
    //     answer.style = 'plain';

    // response.writeHead(answer.status, headers[answer.style]);

    // if (answer.style === 'plain')
    //     response.end(answer.body);

});

server.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
})


function doGet(pathname, request, response) {
    let answer = {};

    switch (pathname) {
        case '/update':
            updater.remember(response);
            request.on('close', () =>
                updater.forget(response));
            setImmediate(() =>
                updater.update(
                    model.get()));
            answer.style = 'sse';
            break;
        default:
            answer.status = 400;
            break;
    }

    return answer;
}

function doPost(pathname, request, callback) {
    var answer = {};

    switch (pathname) {
        case '/incr':
            model.incr();
            updater.update(model.get());
            break;
        case '/reset':
            model.reset();
            updater.update(model.get());
            break;
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
            callback(err, answer);
            break;
    }
}