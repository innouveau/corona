import _base from './_base-module';

const state = {
    mappingType: 'event',
    mappingMaxDays: 21,
    mappingStartNumber: 10,
    mappingNumberStyle: 'absolute',
    mappingEventType: 'lockdown',
    mappingDate: null,
    logScale: true,
    perCapita: true,
    cutYaxis: true,
    smoothening: 7
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