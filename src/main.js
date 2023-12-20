import { createApp } from 'vue'
import './style.css'
import { pinia } from "./store";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import PaperList from "./components/PaperList.vue";
import PaperDetails from "./components/PaperDetails.vue";

const routes = [
  { path: "/", component: PaperList },
  { path: "/papers/:paperId", component: PaperDetails },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App)
    .use(pinia)
    .use(router)
    .mount("#app");
