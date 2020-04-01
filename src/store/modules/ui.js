import _base from './_base-module';

const state = {
    shareUrlPopup: false,
    description: 'Tool for comparison on Covid 19 development for each country.'
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