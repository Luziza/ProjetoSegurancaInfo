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
    // {
    //   path: '/perguntas1',
    //   name: 'perguntas1',
    //   component: () => import('@/components/Perguntas1.vue')
    // },
    // {
    //   path: '/perguntas2',
    //   name: 'perguntas2',
    //   component: () => import('@/components/Perguntas2.vue')
    // }

  ]
})
export default router