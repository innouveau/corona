import _base from './_base-module';

const today = new Date();
const initialDate = today.setDate(today.getDate() - 50);


const state = {
    mappingType: 'date',
    mappingMaxDays: 120,
    mappingStartNumber: 100,
    mappingNumberStyle: 'absolute',
    mappingEventType: 'lockdown',
    mappingDate: new Date(initialDate),
    logScale: false,
    perCapita: false,
    cutYaxis: false,
    cumulative: false,
    graphSetting: 'Both',
    shift: 0,

    showEvents: true,
    eventTypes: [],
    hasDescriptionViaQuery: false,
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