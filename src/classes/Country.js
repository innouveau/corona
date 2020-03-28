class Country {
    constructor({
        id = null,
        title = '',
        color = '',
        entries = []
    }) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.entries = entries;
        this.active = false;
    }
}

export default Country;