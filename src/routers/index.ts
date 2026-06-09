import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: '',
      component: () => import('@/components/Home.vue')
    },
    {
      path: '/escolha',
      name: 'escolha',
      component: () => import('@/components/Escolha.vue')
    },

  ]
})
export default router 