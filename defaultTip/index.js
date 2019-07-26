import DefaultTipComponent from './index.vue'

const DefaultTip = {
    install: function(Vue) {
        Vue.component('defaultTip', DefaultTipComponent)
    }
}

export default DefaultTip