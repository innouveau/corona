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
    updatePropertyOfItem(state, payload) {
        _base.mutations.updatePropertyOfItem(state, payload.item, payload.property, payload.value);
    },
    addEvent(state, payload) {
        state.all = state.all.map((country) => {
            if (country.title === payload.country) {
                country.addEvent(payload.event);
            }
            return country;
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