import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import countries from './modules/countries';
import types from './modules/types';
import settings from './modules/settings';
import ui from './modules/ui';
import eventTypes from './modules/event-types';
import errorModal from './modules/error-modal'
import explanation from './modules/explanation'

const state = {
    dataLoaded: false
};
const mutations = {
    updateProperty(state, payload) {
        state[payload.key] = payload.value;
    }
};

export default new Vuex.Store({
    state,
    mutations,
    actions: {},
    modules: {
        countries, types, settings, ui, eventTypes,
        errorModal, explanation
    }

})
