import { createRouter, createWebHistory } from "vue-router";
import TradingView from "@/views/TradingView.vue";
import ProfileView from "@/views/ProfileView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

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
