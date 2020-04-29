class Event {
    constructor({
        type = '',
        title = '',
        date = ''
    }) {
        this.type = type;
        this.title = title;
        this.date = date;
    }
}

export default Event;