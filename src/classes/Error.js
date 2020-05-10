class Error {
    constructor(error) {
        this.level = error.level || 0;
        this.message = error.message;
    }
}

export default Error;