<template>
    <div>
        <p>Routes go here:</p>
        <ul>
            <li><router-link to="/">/</router-link></li>
            <li><router-link to="/thing">/thing</router-link></li>
            <li><router-link to="/tasks">/tasks</router-link></li>
            <li><router-link to="/tasks/add">/tasks/add</router-link></li>
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
    computed: mapGetters(["numberOfTasks", "numberOfIncompleteTasks"])
};
</script>
