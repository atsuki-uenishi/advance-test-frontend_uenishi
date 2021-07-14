export const state = () => ({
    contact: {}
});

export const mutations = {
    contactKeep(state, contactData) {
        state.contact = contactData;
    },
    contactClear(state) {
        state.contact = {};
    },
};