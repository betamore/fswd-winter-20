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
    data: function() {
        return { task: {} };
    },
    methods: {
        toggleCompleted(string, event) {
            console.log("checkbox changed!");
        }
    },
    async mounted() {
        const response = await axios.get(
            `http://localhost:8000/tasks/${this.id}`
        );
        this.task = response.data;
    }
};
</script>
