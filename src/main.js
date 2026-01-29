import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
// import { io } from 'socket.io-client';
import gAuth from 'vue3-google-login';


// const socket = io('http://localhost:3000');
const app = createApp(App)
app.use(router)

app.use(gAuth,{
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
})

// app.config.globalProperties.$socket = socket;

app.mount('#app')