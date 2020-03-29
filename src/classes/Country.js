class Country {
    constructor({
        id = null,
        title = '',
        color = '',
        population = 0,
        entries = []
    }) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.population = population
        this.entries = entries;
        this.active = false;
    }
}

export default Country;