<template>
    <div>
        <form @submit.prevent="register">
            <div class="field">
                <label class="label">Name</label>
                <div class="control">
                    <input
                        required
                        :class="{ input: true, 'is-danger': !nameFilledOut }"
                        type="text"
                        name="name"
                        v-model="name"
                    />
                </div>
                <p v-show="!nameFilledOut" class="help is-danger">
                    Name is required
                </p>
            </div>
            <div class="field">
                <label class="label">Email</label>
                <div class="control">
                    <input
                        required
                        :class="{ input: true, 'is-danger': emailExists }"
                        type="email"
                        name="email"
                        v-model="email"
                    />
                </div>
                <p v-show="emailExists" class="help is-danger">Email exists.</p>
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
                    <input
                        required
                        class="input"
                        type="password"
                        name="passwordConfirm"
                        v-model="passwordConfirm"
                    />
                </div>
                <p v-show="!passwordsMatch" class="help is-danger">
                    Passwords must match.
                </p>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link" :disabled="!canRegister">
                        Register
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";

export default {
    data() {
        return {
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
            emailExists: false,
            checkTimeoutId: null
        };
    },
    watch: {
        // email(newVal, oldVal) {
        //     this.checkEmail();
        // }
        // email: function(newVal, oldVal) {
        //     this.checkEmail()
        // },
        email: debounce(function() {
            this.checkEmail();
        }, 300)
    },
    computed: {
        nameFilledOut() {
            return !!this.name;
        },
        passwordsMatch() {
            return this.password === this.passwordConfirm;
        },
        canRegister() {
            return (
                this.name &&
                this.email &&
                this.password &&
                this.passwordConfirm &&
                this.passwordsMatch
            );
        }
    },
    methods: {
        async register() {
            try {
                await this.$store.dispatch("registerUser", {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    passwordConfirm: this.passwordConfirm
                });
                this.$router.push("/tasks");
            } catch (e) {
                debugger;
                console.log(e.response.data); // vue property?
            }
        },
        async checkEmail() {
            // console.log("checkEmail");
            // if (this.checkTimeoutId) {
            //     console.log("canceling timeout");
            //     clearTimeout(this.checkTimeoutId);
            // }
            // this.checkTimeoutId = setTimeout(async () => {
            //     console.log("checking the email");
            //     const response = await axios.post("/register/email-check", {
            //         email: this.email
            //     });
            //     this.emailExists = response.data;
            // }, 5000);
            console.log("checking the email");
            const response = await axios.post("/register/email-check", {
                email: this.email
            });
            this.emailExists = response.data;
        }
    }
};
</script>
