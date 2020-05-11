import _base from './_base-module';

const Model = Object;

const state = {
    all: [],
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
    setCurrent(state, item) {
        return _base.mutations.setCurrent(state, item);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}