//const baseUrl = "http://twserver.alunos.dcc.fc.up.pt:8008";
const baseUrl = "http://localhost:8972";

//const baseUrl = "http://twserver.alunos.dcc.fc.up.pt:8972";


function register(username, password, callback) {
    const url = baseUrl + "/register";

    fetch(url, {
            method: "POST",
            body: JSON.stringify({
                nick: username,
                password: password
            })
        })
        .then((res) => {
            if (res.status === 200) {
                callback(username, password);
            } else {
                res.text().then((text) => {
                     callback(null, null, text)
                    });
            }
        })
        .catch((err) => {
            callback(err);
            return false;
        })
}


function ranking(callback) {
    const url = baseUrl + "/ranking";
    fetch(url, {
            method: 'POST',
            body: JSON.stringify({})
        })
        .then((res) => {
            if (res.status === 200) {
                res.text().then((text) => { callback(text) });
            } else {
                callback(null);
            }
        });
}

function join(username, password, nHoles, nSeeds, callback) {
    const url = baseUrl + "/join";

    fetch(url, {
            method: "POST",
            body: JSON.stringify({
                group: 72,
                nick: username,
                password: password,
                size: nHoles,
                initial: nSeeds
            })
        })
        .then((res) => {
            if (res.status === 200) {
                res.text().then((text) => {
                    const gameRef = JSON.parse(text).game;
                    callback(gameRef)
                });
            } else {
                res.text().then((text) => { callback(null, null, text) });
            }
        })
        .catch((err) => {
            callback(err);
            return false;
        })
}

function notify(username, password, gameRef, playerMove, callback) {
    const url = baseUrl + "/notify";

    fetch(url, {
            method: "POST",
            body: JSON.stringify({
                nick: username,
                password: password,
                game: gameRef,
                move: playerMove
            })
        })
        .then((res) => {
            if (res.status === 200) {
                callback(null);
            } else {
                res.text().then((text) => { callback(text) });
            }
        })
        .catch((err) => {
            callback(err);
        })
}

function leave(username, password, gameRef, callback) {
    const url = baseUrl + "/leave";

    fetch(url, {
            method: "POST",
            body: JSON.stringify({
                nick: username,
                password: password,
                game: gameRef
            })
        })
        .then((res) => {
            if (res.status === 200) {
                callback(null);
            } else {
                res.text().then((text) => { callback(text) });
            }
        })
        .catch((err) => {
            callback(err);
            return false;
        })
}

function update(username, gameRef) {
    const url = baseUrl + "/update?nick=" + username + '&game=' + gameRef;

    const evtSource = new EventSource(url);

    return evtSource;
}

export {
    register,
    ranking,
    join,
    notify,
    update,
    leave
};