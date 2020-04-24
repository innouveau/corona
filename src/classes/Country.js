import Event from '@/classes/Event';

class Country {
    constructor({
        id = null,
        title = '',
        searchTags = '',
        color = '',
        population = 0,
        entries = []
    }) {
        this.id = id;
        this.title = title;
        this.searchTags = searchTags;
        this.color = color;
        this.population = population;
        this.entries = entries;
        this.active = false;
        this.visible = true;
        this.events = [];
    }

    showInGraph() {
        return this.active && this.visible;
    }

    addEvent(event) {
        this.events.push(new Event(event));
    }
}

export default Country;