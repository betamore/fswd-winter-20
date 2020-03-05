<template>
    <div>
        <p v-if="isLoggedIn">You are logged in!</p>
        <p v-else>Login!</p>
        <ul>
            <li><router-link to="/">/</router-link></li>
            <li><router-link to="/thing">/thing</router-link></li>
            <li><router-link to="/tasks">/tasks</router-link></li>
            <li><router-link to="/tasks/add">/tasks/add</router-link></li>
            <li v-if="!isLoggedIn">
                <router-link to="/register">Register!</router-link>
            </li>
        </ul>
        <p>
            There are {{ numberOfTasks }} tasks ({{ numberOfIncompleteTasks }}
            incomplete).
        </p>
    </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
    computed: mapGetters([
        "numberOfTasks",
        "numberOfIncompleteTasks",
        "isLoggedIn"
    ])
};
</script>
