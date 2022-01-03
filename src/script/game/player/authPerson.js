import Person from './person.js';

import { notify } from "../../utils/requests.js";

class AuthPerson extends Person {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }

    play(holeIndex, gameRef) {
        let val = true;
        if (holeIndex !== undefined) {
            val = super.play(holeIndex);
            notify(this.username, this.password, gameRef, holeIndex, this.notificationError);
        }
        return val;
    }

    notificationError(error) {
        if (error) {
            alert(error);
        }
    }
}


export default AuthPerson;