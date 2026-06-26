import { createRouter, createWebHistory } from 'vue-router'

function isAuthenticated() {
  const token = localStorage.getItem('authToken')
  return Boolean(token)
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/components/Home.vue')
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: () => import('@/components/usuario/CriarUsuario.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/components/Primeiro.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/components/Dashbord.vue'),
      meta: { requiresAuth: true },
      props: route => ({ empresaCriada: Number(route.query.empresaCriada ?? 0) })
    }
  ]
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login' }
  }

  if (to.name === 'login' && isAuthenticated()) {
    return { name: 'home' }
  }
})

export default router 