<template>
    <div>
        <form @submit.prevent="addTask">
            <input type="text" v-model="newTask" />
            <button type="submit">Add Task</button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return { newTask: "" };
    },
    methods: {
        async addTask() {
            this.$store.dispatch("addTask", { name: this.newTask });
            this.newTask = "";
        }
    }
};
</script>
