import DefaultTipComponent from './defaultTip.vue'

const DefaultTip = {
    install: function(Vue) {
        Vue.component('defaultTip', DefaultTipComponent)
    }
}

export default DefaultTip