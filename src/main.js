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
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons"
/* add icons to the library */
library.add(faCircleHalfStroke)

import "./assets/main.css"

createApp(App).component("font-awesome-icon", FontAwesomeIcon).use(router).use(Vue3Storage, {namespace: "ts_"}).mount("#app")
