<template>
    <div>
        <form @submit.prevent="login">
            <div class="field">
                <label class="label">Email</label>
                <div class="control">
                    <input required class="input" type="email" name="email" v-model="email" />
                </div>
                <p v-show="!email" class="help is-danger">Email is required</p>
            </div>
            <div class="field">
                <label class="label">Password</label>
                <div class="control">
                    <input
                        required
                        class="input"
                        type="password"
                        name="password"
                        v-model="password"
                    />
                </div>
                <p v-show="!password" class="help is-danger">Password is required</p>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link">Login</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            email: "",
            password: ""
        };
    },

    methods: {
        async login() {
            try {
                await this.$store.dispatch("loginUser", {
                    email: this.email,
                    password: this.password
                });
                this.$router.push("/tasks");
            } catch (e) {
                console.log(e.response.data);
            }
        }
    }
};
</script>