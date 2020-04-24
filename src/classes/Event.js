class Event {
    constructor({
        id = null,
        type = '',
        title = '',
        date = ''
    }) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.date = date;
    }
}

export default Event;