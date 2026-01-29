import { createRouter, createWebHistory } from 'vue-router';

import SidebarLayout from '../layouts/SidebarLayout.vue';
import NoSidebarLayout from '../layouts/NoSidebarLayout.vue';

import Landing from '../views/Landing.vue';
import Login from '../views/auth/Login.vue';

import Home from '../views/apps/Home.vue';
import About from '../views/apps/About.vue';
import News from '../views/apps/News.vue';
import PeopleCounter from '../views/apps/PeopleCounter.vue';
import Board from '../views/apps/Board.vue';


const routes = [
  {
    path: '/',
    component: NoSidebarLayout,
    children: [
      {
        path: '',
        name: 'Landing',
        component: Landing
      },
      {
        path: 'login',
        name: 'Login',
        component: Login
      }
    ]
  },
  {
    path: '/app',
    component: SidebarLayout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'board',
        name: 'Board',
        component: Board
      },
      {
        path: 'news',
        name: 'News',
        component: News
      },
      {
        path: 'about',
        name: 'About',
        component: About
      },
      // {
      //   path: 'peoplecounter',
      //   name: 'PeopleCounter',
      //   component: PeopleCounter
      // }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
