import { createRouter, createWebHistory } from "vue-router";
import TradingView from "@/views/TradingView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ErrorView from "@/views/ErrorView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import LogoutView from "@/views/auth/LogoutView.vue";
import SignupView from "@/views/auth/SignupView.vue";

const routes = [
  {
    path: "/",
    name: "trading",
    component: TradingView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/logout",
    name: "logout",
    component: LogoutView,
  },
  {
    path: "/error",
    name: "error",
    props: (route) => ({ err: route.query.err }),
    component: ErrorView,
  },
  // catchall 404
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
