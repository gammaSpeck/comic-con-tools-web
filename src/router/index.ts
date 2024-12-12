import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WhatsappChatCounter from '@/views/WhatsappChatCounter.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat-counter',
      name: 'chatCounter',
      component: WhatsappChatCounter,
    },
  ],
})

export default router
