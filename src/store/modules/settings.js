import _base from './_base-module';

const state = {
    startAt: 100,
    stopAt: 30,
    mappingType: 'fatalities',
    logScale: true,
    perCapita: false,
    growthRatePer: 4,
    cutY: true
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