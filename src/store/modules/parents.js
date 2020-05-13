import _base from './_base-module';
import Parent from '@/classes/Parent';

const Model = Parent;

const state = {
    all: [],
    selected: [],
    current: null
};

const getters = {
    ..._base.getters
};

const actions = {};

const mutations = {
    init(state, set) {
        return _base.mutations.init(state, set, Model);
    },
    create(state, item) {
        _base.mutations.create(state, item, Model);
    },
    updatePropertyOfItem(state, payload) {
        _base.mutations.updatePropertyOfItem(state, payload.item, payload.property, payload.value);
    },
    addChild(state, payload) {
        state.all = state.all.map((parent) => {
            if (parent.id === payload.item.id) {
                parent.regions.push(payload.child);
            }
            return parent;
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}