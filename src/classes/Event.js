import Measure from '@/classes/Measure';


function transformDate(value) {
    return value.replace(/\//g, '-');
}


class Event {
    constructor({
        DATE_IMPLEMENTED = '',
        measures = [],
    }) {
        this.DATE_IMPLEMENTED = DATE_IMPLEMENTED;
        this.measures = [];
    }

    get date() {
        return transformDate(this.DATE_IMPLEMENTED);
    }

    addMeasure(measure) {
        let categories = ['Social distancing', 'Lockdown'];
        if (categories.indexOf(measure.CATEGORY) > -1) {
            this.measures.push(new Measure(measure));
        }
    }

    getContent() {
        return '<b>' + this.date + '</b><br>' + this.measures.map(m => m.getTitle()).join('<br>');
    }
}

export default Event;