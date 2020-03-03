<template>
    <ol>
        <Task v-for="task in tasks" :key="task.id" :task="task" />
    </ol>
</template>

<script>
import Task from "./Task.vue";
import { mapState } from "vuex";

export default {
    components: { Task },
    computed: mapState(["tasks"])
};
</script>
