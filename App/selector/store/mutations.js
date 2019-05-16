const mutations = {
    changeLanguage(state, lang) {
        state.language = lang
        Vue.config.lang = state.language
    },
    showLoading(state, status) {
        state.globalLoading = status
    }
}

export default mutations