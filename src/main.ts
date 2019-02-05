import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './helpers';
import './registerServiceWorker';

Vue.config.productionTip = false;
const environment = window.location.host === 'app.kohkane.com' ?
  'production' : window.location.host === 'staging.kohane.com' ?
  'staging' :
  'development';
const baseUrls = {
  production: 'https://api.kohkane.com/v1',
  staging: 'https://api.kohkane.com/staging',
  development: 'http://0.0.0.0:3000',
};


new Vue({
  router,
  store,
  render: (h) => h(App),
  mounted() {
    // Fix blank screen in Electron builds
    this.$router.push('/');
  },
}).$mount('#app');
