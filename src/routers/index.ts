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
      component:() => import('@/components/Primeiro.vue'),
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

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('authUser')

  if (to.meta.requiresAuth && !user) {
    next({ name: 'login' })
    return
  }

  if (to.name === 'login' && user) {
    next({ name: 'home' })
    return
  }

  next()
})
export default router 