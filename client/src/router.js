import Vue from "vue";
import Router from "vue-router";

import HomePage from "./home/HomePage";
import Payments from "./home/Payments";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    { path: "/", component: HomePage },
    { path: "/payments", component: Payments }
  ]
});
