import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import router from '@/routers'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

// Styles
import 'unfonts.css'
const pinia = createPinia()

const app = createApp(App)
app.use(router)  
app.use(VueQueryPlugin)
app.use(vuetify)    
app.use(pinia)


registerPlugins(app)

app.mount('#app')
