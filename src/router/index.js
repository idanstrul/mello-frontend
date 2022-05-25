import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import boards from '../views/boards.vue'
import boardList from '../views/board-list.vue'
import boardDetails from '../views/board-details.vue'
import taskDetails from '../views/task-details.vue'
import login from '../views/login.vue'
import signup from '../views/signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/board',
      name: 'boards',
      component: boardList
    },
    {
      path: '/board/:boardId',
      name: 'board',
      component: boardDetails,
      children: [
        {
          path: 'task/:groupId/:taskId',
          name: 'task-details',
          component: taskDetails
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: signup
    },
  ]
})

export default router
