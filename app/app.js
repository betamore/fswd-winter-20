import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import axios from "axios";

import Base from "./Base.vue";
import Thing from "./Thing.vue";
import TaskList from "./TaskList.vue";
import IndividualTask from "./IndividualTask.vue";
import AddTask from "./AddTask.vue";

// load in bbulm
import "./../node_modules/bulma/css/bulma.css";

Vue.config.devtools = true;

Vue.use(VueRouter);
Vue.use(Vuex);

var store = new Vuex.Store({
    state: {
        count: 0,
        tasks: []
    },
    mutations: {
        incrementCounter(state, payload = 1) {
            state.count = state.count + payload;
        },
        setTasks(state, payload) {
            state.tasks = payload;
        }
    },
    actions: {
        async fetchTasks(store) {
            const response = await axios.get("/tasks");
            store.commit("setTasks", response.data);
        },
        async addTask(store, newTask) {
            const response = await axios.post("/tasks", newTask);
            store.commit("setTasks", store.state.tasks.concat([response.data]));
        }
    },
    getters: {
        numberOfTasks(state) {
            return state.tasks.length;
        },
        numberOfIncompleteTasks(state) {
            return state.tasks.filter(task => !task.completedAt).length;
        },
        getTaskById(state) {
            return id => {
                const idAsInt = parseInt(id);
                return state.tasks.find(task => task.id === idAsInt);
            };
        }
    }
});

const routes = [
    { path: "/", component: Base },
    {
        path: "/thing",
        component: Thing
    },
    { path: "/tasks", component: TaskList },
    { path: "/tasks/add", component: AddTask },
    { path: "/tasks/:id", component: IndividualTask, props: true }
];

const router = new VueRouter({
    routes
});

import App from "./App.vue";

console.log(router);
var app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
