import _base from './_base-module';

const state = {
    updatedAt: window.config.updatetAt,
    shareUrlPopup: false,
    description: 'Tool for comparison on Covid 19 development for countries and regions',
    currentRegion: null
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