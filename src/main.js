import { createApp } from "vue"
import App from "./App.vue"

// import "./assets/main.css"
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

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app")
