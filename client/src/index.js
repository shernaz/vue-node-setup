import Vue from "vue";

import { router } from "./router";
import App from "./app/App";

Vue.config.devtools = true;

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
