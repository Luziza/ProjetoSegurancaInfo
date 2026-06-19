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
    {
       path: '/cadastro',
      name: 'cadastro',
      component: () => import('@/components/usuario/CriarUsuario.vue')
    },
    {
       path: '/a',
      name: 'a',
      component: () => import('@/components/Dashbord.vue')
    }
  ]
})
export default router 