import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Blog from '../views/Blog.vue'
import QnA from '../views/Q&A.vue'
import Discussion from '../views/Discussion.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Pagi from '../views/Pagination.vue'
import Post from '../views/Post.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Home }, // 👈 Trang mặc định là Home
      { path: 'blog', component: Blog },
      { path: 'qna', component: QnA },
      { path: 'discussion', component: Discussion },
      { path: 'about', component: About },
      { path: 'pagi', component: Pagi },
      { path: 'post', component: Post },
    ],
  },

  { path: '/login', component: Login },
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
