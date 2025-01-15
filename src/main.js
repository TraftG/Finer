import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import {
    createTonConnectUIProvider,
    TonConnectUIContext,
    TonConnectUIOptionsContext
} from 'ton-ui-vue';

const { tonConnectUI, setOptions } = createTonConnectUIProvider({
    manifestUrl: 'https://your-manifest-url'
});

const app = createApp(App);

app.provide(TonConnectUIContext, tonConnectUI);
app.provide(TonConnectUIOptionsContext, setOptions);

app.use(router);
app.mount('#app');
