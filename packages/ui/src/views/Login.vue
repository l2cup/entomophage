<template>
  <b-container>
    <h3 class="mt-3 mb-2 text-danger">{{ this.loginError }}</h3>
    <b-form>
      <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="username"
          type="text"
          required
          placeholder="Enter username"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          type="password"
          v-model="password"
          required
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>
      <b-button
        v-on:click="login()"
        variant="primary"
      >Login</b-button>
      <br><br><br>
          <small class="subtitle">Don't have an account?</small>
          <br>
          <router-link class="text-secondary" :to="'/register'">
            Register now!
          </router-link>
        </b-form>
      </b-container>
    </template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import UserModule from '../store/modules/users';

@Component
export default class Login extends Vue {
  username='';

  password = '';

  loginError = '';

  login() {
    UserModule
      .login({
        username: this.username,
        password: this.password,
      })
      .then(() => this.$router.push('/'))
      .catch((err) => {
        console.error(err);
        this.loginError = 'Wrong username or password.';
      });
  }
}

</script>
<style scoped>

</style>
