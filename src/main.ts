import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia"
import "./assets/fonts/iconfont.css"

const app = createApp(App);
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
