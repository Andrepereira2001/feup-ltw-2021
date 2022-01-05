import Person from './person.js';

import { notify } from "../../utils/requests.js";

class AuthPerson extends Person {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }

    play(holeIndex, gameRef, error) {
        if (super.play(holeIndex) && gameRef !== null) {
            notify(this.username, this.password, gameRef, holeIndex, error);
        }

    }

}


export default AuthPerson;