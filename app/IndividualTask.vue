<template>
    <div>
        <input
            v-if="!task.completedAt"
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
        async toggleCompleted(event) {
            try {
                await this.$store.dispatch("completeTask", this.task);
                this.$router.push("/tasks");
            } catch (e) {
                console.log(e);
            }
        }
    }
};
</script>
