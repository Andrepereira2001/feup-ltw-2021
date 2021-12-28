const baseUrl = "http://twserver.alunos.dcc.fc.up.pt:8008";

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
                res.text().then((text) => { callback(null, null, text) });
            }
        })
        .catch((err) => {
            console.log("error", err)
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
            console.log(res.status);
            if (res.status === 200) {
                res.text().then((text) => { callback(text) });
            } else {
                callback(null);
            }
        });
}

export {
    register,
    ranking
};