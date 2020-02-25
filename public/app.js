Vue.component("task-list", {
    props: ["tasks"],
    template: `
    <ul>
        <task v-for="task in tasks" :name="task.name" />
    </ul>
    `
});

Vue.component("task", {
    props: ["name"],
    computed: {
        taskIsCompleted() {
            return this.name.length % 2 === 0;
        }
    },
    template: `<li>This is my task component: {{ name }}<span v-if="taskIsCompleted"> is completed</span></li>`
});

var app = new Vue({
    el: "#app",
    data: {
        message: "This is the application",
        tasks: [],
        newTask: "",
        taskSearch: ""
    },
    template: `
    <div>
        <p>{{message}}</p>
        <p>{{ numberOfTasks }} Tasks:</p>
        <task-list :tasks="tasks" />
        <input type="text" v-model="newTask" />
        <button @click="addTask">Add</button>
        <p>Filtered tasks:</p>
        <input type="text" v-model="taskSearch" />
        <task-list :tasks="filteredTasks" />
    </div>
    `,
    computed: {
        numberOfTasks() {
            return this.tasks.length;
        },
        filteredTasks() {
            return this.tasks.filter(task =>
                task.name.includes(this.taskSearch)
            );
        }
    },
    methods: {
        getTaskCount() {
            alert(`There are ${this.numberOfTasks} tasks`);
        },
        addTask() {
            this.tasks.push(this.newTask);
            this.newTask = "";
        }
    },
    async mounted() {
        const response = await axios.get("http://localhost:8000/tasks");
        this.tasks = response.data;
    }
});
