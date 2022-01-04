import Person from './person.js';

import { notify } from "../../utils/requests.js";

class AuthPerson extends Person {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }

    play(holeIndex, gameRef, error) {
        let val = super.play(holeIndex);;
        if (holeIndex !== undefined) {
            notify(this.username, this.password, gameRef, holeIndex, error);
        }
        return val;
    }

}


export default AuthPerson;