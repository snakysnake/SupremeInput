import { App, Plugin } from 'vue'

import SupremeLabel from './SupremeLabel.vue'

export default {
    install(Vue: App) {
        Vue.component(SupremeLabel.name, SupremeLabel)
    }
} as Plugin

export {
    SupremeLabel as SupremeLabel
}
