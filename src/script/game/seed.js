class Seed {
    //side -> indicates which player side (1 / 2)
    //index -> index in the array from left to right (0-3)
    constructor(){
        this.postionx = Math.floor(Math.random() * 50);
        this.postiony = Math.floor(Math.random() * 50);
    }
 
}

export default Seed;

