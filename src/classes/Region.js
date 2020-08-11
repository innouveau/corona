import Event from '@/classes/Event';

class Region {
    constructor({
        id = null,
        title = '',
        color = '',
        population = 0,
    }) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.population = population;

        // added properties
        this.parent = null;
        this.entries = [];
        this.events = [];

        // state
        this.dataLoaded = false;
        this.active = false;
        this.visible = true;
    }

    showInGraph() {
        return this.active && this.visible;
    }

    addEvent(event) {
        this.events.push(new Event(event));
    }

    addEntries(entries) {
        for (let day of entries) {
            this.entries.push(day)
        }
    }

    get lastEntry() {
        return this.entries[this.entries.length - 1];
    }

    get populationString() {
        let n, million, mille;
        million = 1000000;
        mille = 1000;
        if (this.population >= million) {
            n = Math.round(this.population / million);
            return n + 'M';
        } else if (this.population >= mille) {
            n = Math.round(this.population / mille);
            return n + 'k';
        } else {
            return this.population;
        }
    }
}

export default Region;