const actions = {
    changeLanguage({
        commit
    }, lang) {
        commit('changeLanguage', lang)
    },
    showLoading({
        commit
    }, status) {
        commit('showLoading', status)
    }
}

export default actions