import Person from './person.js';

class AuthPerson extends Person {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }
}


export default AuthPerson;