<template>
    <ol>
        <Task v-for="task in tasks" :key="task.id" :task="task" />
    </ol>
</template>

<script>
import Task from "./Task.vue";
import axios from "axios";

export default {
    components: { Task },
    data: function() {
        return { tasks: [] };
    },
    async mounted() {
        const response = await axios.get("http://localhost:8000/tasks");
        this.tasks = response.data;
    }
};
</script>
