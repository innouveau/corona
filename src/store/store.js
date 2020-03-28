import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import countries from './modules/countries';
import types from './modules/types';

const state = {};
const mutations = {};

export default new Vuex.Store({
    state,
    mutations,
    actions: {},
    modules: {
        countries, types
    }

})
