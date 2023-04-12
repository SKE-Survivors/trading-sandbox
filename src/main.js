import { createApp } from "vue"
import App from "./App.vue"
import router from './router'
import Vue3Storage from "vue3-storage"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core"
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
/* import specific icons */
import { faCircleHalfStroke, faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { fab } from '@fortawesome/free-brands-svg-icons'
import mitt from 'mitt';
/* add icons to the library */
library.add(faCircleHalfStroke)
library.add(faCaretDown)
library.add(fab)

import "./assets/main.css"

const emitter = mitt();

const app = createApp(App)
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(router)
app.use(Vue3Storage, {namespace: "ts_"})
app.config.globalProperties.emitter = emitter
app.mount("#app")
