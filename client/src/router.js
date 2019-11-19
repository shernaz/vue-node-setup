import Vue from "vue";
import Router from "vue-router";

import HomePage from "./home/HomePage";
import Payments from "./home/Payments";
import UsersPage from "./users/UsersPage";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    { path: "/", component: HomePage },
    { path: "/users", component: UsersPage },
    { path: "/payments", component: Payments }
  ]
});
