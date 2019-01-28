import Vue from 'vue';
// import store from './store';
import 'document-register-element/build/document-register-element';
import vueCustomElement from 'vue-custom-element';

import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(vueCustomElement);

Vue.customElement('vue-audio-player', App);
