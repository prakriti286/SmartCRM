import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'admin-lte/dist/css/adminlte.min.css'

import Swal from 'sweetalert2'

const app = createApp(App)

app.use(router)
app.use(store)
app.config.globalProperties.$swal = Swal

app.mount('#app')