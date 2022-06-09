import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminView from "../views/AdminView.vue";
import EditView from "../views/EditView.vue";
import { currentUserPromise } from "../firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      auth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: {
      auth: true,
    },
  },
  {
    path: "/edit/:id",
    name: "edit",
    component: EditView,
    meta: {
      auth: true,
    },
  },
  {
    path: "/*",
    name: "login",
    component: LoginView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log("entraste al beforeEach");

  const requireAuth = to.meta.auth;
  const user = await currentUserPromise();

  if (requireAuth) {
    if (user) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
