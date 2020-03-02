import Vue from "vue";
import VueRouter from "vue-router";
import Base from "./Base.vue";
import Thing from "./Thing.vue";
import TaskList from "./TaskList.vue";
import IndividualTask from "./IndividualTask.vue";

// load in bbulm
import "./../node_modules/bulma/css/bulma.css";

Vue.use(VueRouter);

const routes = [
    { path: "/", component: Base },
    {
        path: "/thing",
        component: Thing
    },
    { path: "/tasks", component: TaskList },
    { path: "/tasks/:id", component: IndividualTask, props: true }
];

const router = new VueRouter({
    routes
});

import App from "./App.vue";

console.log(router);
var app = new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
