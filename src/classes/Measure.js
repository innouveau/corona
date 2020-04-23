class Measure {
    constructor({
            MEASURE = '',
            ADMIN_LEVEL_NAME = ''
        }
    ) {
        this.title = MEASURE;
        this.subregion = ADMIN_LEVEL_NAME;
    }

    getTitle() {
        let string = this.title;
        if (this.subregion.length > 0) {
            string += ' (' + this.subregion + ')';
        }
        return string;
    }
}

export default Measure;