import _base from './_base-module';

const state = {
    startAt: 10,
    stopAt: 21,
    mappingType: 'event',
    startAtStyle: 'absolute',
    eventType: 'lockdown',
    mappingDate: null,
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