class Parent {
    constructor({
        id = null,
        title = '',
        regions = [],
        originalRegion = null,
        merged = false
    }) {
        this.id = id;
        this.title = title;
        this.regions = regions;
        this.originalRegion = originalRegion;
        this.merged = merged;
    }
}

export default Parent;