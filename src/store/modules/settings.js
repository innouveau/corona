import _base from './_base-module';

const state = {
    fatalities: 100,
    logScale: false,
    perCapita: false
};

const getters = {
    ..._base.getters
};

const actions = {};

const mutations = {
    updateProperty(state, payload) {
        state[payload.key] = payload.value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}