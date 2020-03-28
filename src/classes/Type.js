class Type {
    constructor({
        id = null,
        title = '',
        property = ''
    }) {
        this.id = id;
        this.title = title;
        this.property = property;
        this.active = false;
    }
}

export default Type;