import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { Ckeditor } from '@ckeditor/ckeditor5-vue'

const app = createApp(App)
app.use(router)
app.component('Ckeditor', Ckeditor)
app.mount('#app')
