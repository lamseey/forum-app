import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import AdminView from '../views/Admin.vue'
import DiscussionView from '../views/Discussion.vue'
import LoginView from '../views/Login.vue'
import RegisterView from '../views/Register.vue'
import ProfileView from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'home-view',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'admin-view',
    component: AdminView
  },
  {
    path: '/discussion/:id',
    name: 'discussion-view',
    component: DiscussionView
  },
  {
    path: '/login',
    name: 'login-view',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register-view',
    component: RegisterView
  }
  ,
  {
    path: '/profile',
    name: 'profile-view',
    component: ProfileView
  },
  {
    path: "/categorylist",
    name: "CategoryList",
    component: () => import("../views/CategoryList.vue"),
  },
  {
    path: '/category/:id',
    name: 'category',
    component: () => import('../views/Category.vue')
  },
  {
    path: '/users/:id',
    name: 'users',
    component: () => import('../views/User.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
