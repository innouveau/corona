import _base from './_base-module';

const state = {
    startAt: 10,
    stopAt: 50,
    mappingType: 'fatalities',
    startAtStyle: 'absolute',
    logScale: true,
    perCapita: true,
    growthRatePer: 7,
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