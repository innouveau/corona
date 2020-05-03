import _base from './_base-module';
import EventType from '@/classes/EventType';

const Model = EventType;

const state = {
    all: []
};

const getters = {
    ..._base.getters
};

const actions = {};

const mutations = {
    init(state, set) {
        return _base.mutations.init(state, set, Model);
    },
    create(state, item) {
        return _base.mutations.create(state, item, Model);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}