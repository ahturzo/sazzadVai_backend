import Login from "./components/auth/login";
import Dashboard from "./components/app/dashboard";
//users
import AllUsers from "./components/app/user/index"

// post
import AllPost from "./components/app/post/index";

import store from './store/index';

export const routes = [

  // login
  {
    path: '/',
    component: Dashboard,
    beforeEnter(to, from, next) {
      if (store.getters["auth/authenticated"]) {
        next()
      } else {
        next('/login')
      }
    }
  },

  {
    path: '/login',
    component: Login,
    beforeEnter(to, from, next) {
      if (store.getters["auth/authenticated"]) {
        next('/')
      } else {
        next()
      }
    }
  },

  //  users
  {
    path: '/users',
    component: AllUsers,
    beforeEnter(to, from, next) {
      if (store.getters["auth/authenticated"]) {
        next()
      } else {
        next('/login')
      }
    }
  },

  //  post
  {
    path: '/posts',
    component: AllPost,
    beforeEnter(to, from, next) {
      if (store.getters["auth/authenticated"]) {
        next()
      } else {
        next('/login')
      }
    }
  },
]
