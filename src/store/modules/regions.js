import _base from './_base-module';
import Region from '@/classes/Region';

const Model = Region;

const state = {
    all: [],
    selected: [],
    current: null
};

const getters = {
    ..._base.getters
};

const actions = {};

const mutations = {
    init(state, set) {
        return _base.mutations.init(state, set, Model);
    },
    create(state, Region) {
        state.all.push(Region);
    },
    updatePropertyOfItem(state, payload) {
        _base.mutations.updatePropertyOfItem(state, payload.item, payload.property, payload.value);
    },
    addEntries(state, payload) {
        state.all = state.all.map((region) => {
            if (region === payload.region) {
                region.addEntries(payload.entries);
            }
            return region;
        });
    },
    addEvent(state, payload) {
        state.all = state.all.map((region) => {
            if (region.title === payload.region) {
                region.addEvent(payload.event);
            }
            return region;
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}