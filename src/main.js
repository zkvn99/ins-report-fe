import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'
import './styles/components.css'
import './styles/pages.css'
import './styles/print.css'
import { initialize } from './features/auth/authSession.js'

await initialize()
createApp(App).use(router).mount('#app')
