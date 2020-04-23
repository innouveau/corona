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
        for (let ev of this.events) {
            if (ev.DATE_IMPLEMENTED === event.DATE_IMPLEMENTED) {
                ev.addMeasure(event);
                return;
            }
        }
        this.events.push(new Event(event));
        this.events[this.events.length - 1].addMeasure(event)
    }
}

export default Country;