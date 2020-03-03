<template>
    <div>
        <input
            type="checkbox"
            @change="toggleCompleted"
            :checked="task.completedAt"
        />
        <p>This is task number {{ task.id }}: {{ task.name }}</p>
    </div>
</template>

<script>
import axios from "axios";
export default {
    props: ["id"],
    computed: {
        task() {
            return this.$store.getters.getTaskById(this.id) || {};
        }
    },
    methods: {
        toggleCompleted(string, event) {
            console.log("checkbox changed!");
        }
    }
};
</script>
