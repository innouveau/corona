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
    smoothening: 7,
    showEvents: true,
    eventTypes: []
};

const getters = {
    ..._base.getters
};

const actions = {};

const mutations = {
    updateProperty(state, payload) {
        state[payload.key] = payload.value;
    },
    toggleEventType(state, eventType) {
        let index = state.eventTypes.indexOf(eventType);
        if (index === -1) {
            state.eventTypes.push(eventType);
        } else {
            state.eventTypes.splice(index, 1);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}