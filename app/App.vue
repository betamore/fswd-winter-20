<template>
    <section class="section">
        <div class="container is-fluid">
            <div class="columns">
                <div class="column is-one-quarter content">
                    <NavBar ref="navbarComponent" />
                </div>
                <div class="column">
                    <router-view @addedTask="addedTaskEvent" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import NavBar from "./NavBar.vue";

export default {
    components: { NavBar },
    data: function() {
        return {
            message: "This is the application"
            // tasks: [],
            // newTask: "",
            // taskSearch: ""
        };
    },
    computed: {
        // numberOfTasks() {
        //     return this.tasks.length;
        // },
        // filteredTasks() {
        //     return this.tasks.filter(task =>
        //         task.name.includes(this.taskSearch)
        //     );
        // }
    },
    methods: {
        // getTaskCount() {
        //     alert(`There are ${this.numberOfTasks} tasks`);
        // },
        // async addTask() {
        //     const response = await axios.post("http://localhost:8000/tasks", {
        //         name: this.newTask
        //     });
        //     this.tasks = response.data;
        //     this.newTask = "";
        // }
        addedTaskEvent() {
            console.log("A task was added!");
            this.$refs.navbarComponent.updateNumberOfTasks();
        }
    },
    async mounted() {
        this.$store.dispatch("fetchTasks");
    }
};
</script>
