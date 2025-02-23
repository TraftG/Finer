import { createApp } from 'vue';
import { TonConnectUIPlugin } from '@townsquarelabs/ui-vue'
import App from './App.vue';
import router from './router';



const app = createApp(App);

app.use(TonConnectUIPlugin,{ manifestUrl: "https://finer-9a857.web.app/manifest.json" })


app.use(router);
app.mount('#app');
