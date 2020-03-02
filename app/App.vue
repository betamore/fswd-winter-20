<template>
    <section class="section">
        <div class="container is-fluid">
            <div class="columns">
                <div class="column is-one-quarter content">
                    {{ message }}
                    <p>Routes go here:</p>
                    <ul>
                        <li><router-link to="/">/</router-link></li>
                        <li><router-link to="/thing">/thing</router-link></li>
                        <li><router-link to="/tasks">/tasks</router-link></li>
                    </ul>
                </div>
                <div class="column">
                    <router-view />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from "axios";

export default {
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
    }
};
</script>
