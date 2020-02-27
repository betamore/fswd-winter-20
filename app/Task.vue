<template>
    <li>
        <router-link :to="'/tasks/' + task.id"> {{ task.name }}</router-link>
        <span v-if="taskIsCompleted">is completed</span>
    </li>
</template>

<script>
export default {
    props: ["task"],
    computed: {
        taskIsCompleted() {
            return this.task.name.length % 2 === 0;
        }
    }
};
</script>
