import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import axios from "axios";

import App from "./App.vue";
import Base from "./Base.vue";
import Thing from "./Thing.vue";
import TaskList from "./TaskList.vue";
import IndividualTask from "./IndividualTask.vue";
import AddTask from "./AddTask.vue";
import Register from "./Register.vue";

// load in bbulm
import "./../node_modules/bulma/css/bulma.css";

Vue.config.devtools = true;

Vue.use(VueRouter);
Vue.use(Vuex);

var store = new Vuex.Store({
    state: {
        count: 0,
        tasks: [],
        user: null
    },
    mutations: {
        incrementCounter(state, payload = 1) {
            state.count = state.count + payload;
        },
        setTasks(state, payload) {
            state.tasks = payload;
        },
        updateTask(state, payload) {
            const taskIndex = state.tasks.findIndex(
                task => task.id === payload.id
            );
            if (taskIndex >= 0) {
                Vue.set(state.tasks, taskIndex, payload);
            }
        },
        setUser(state, payload) {
            state.user = payload;
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
        },
        async completeTask(store, task) {
            try {
                const response = await axios.post(`/tasks/${task.id}/complete`);
                store.commit("updateTask", response.data);
            } catch {
                throw Error("Could not complete task for some reason.");
            }
        },
        async registerUser(store, user) {
            const response = await axios.post("/register", user);
            store.commit("setUser", response.data);
        },
        async checkLogin(store) {
            const response = await axios.get("/check-login");
            store.commit("setUser", response.data);
        }
    },
    getters: {
        isLoggedIn(state) {
            return !!state.user;
        },
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
    { path: "/tasks/:id", component: IndividualTask, props: true },
    { path: "/register", component: Register }
];

const router = new VueRouter({
    routes
});

var app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
