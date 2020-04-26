import _base from './_base-module';
import EventType from '@/classes/EventType';

const Model = EventType;

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
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}