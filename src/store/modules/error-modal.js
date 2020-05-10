import Error from '@/classes/Error';

const state = {
    visible: false,
    errors: []
};

const getters = {};

const actions = {};

const mutations = {
    push(state, error) {
        state.visible = true;
        state.errors.push(new Error(error));

    },
    close(state) {
        state.errors = [];
        state.visible = false;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}