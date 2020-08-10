<template>
  <b-container>
    <h3 class="mt-3 mb-2 text-danger">{{ this.error }}</h3>
    <b-form>
      <b-form-group id="input-group-1" label="Username:" label-for="input-1"
      ><b-form-input
          id="input-1"
          required
          v-model="username"
          placeholder="Enter username"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Email address:"
        label-for="input-2"
        description="We'll never share your email with anyone else."
      ><b-form-input
          id="input-2"
          v-model="email"
          required
          type="email"
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Password:" label-for="input-3">
        <b-form-input
          id="input-3"
          type="password"
          required
          v-model="password"
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-3"
        label="Confirm password:"
        label-for="input-3"
      >
        <b-form-input
          id="input-4"
          required
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm password"
        ></b-form-input>
      </b-form-group>
      <b-button
        v-on:click="register()"
        variant="primary"
      >Register</b-button>

    </b-form>
  </b-container>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import usersStore from '../store/modules/users';

@Component
export default class Register extends Vue {
  username='';

  email='';

  password = '';

  confirmPassword = '';

  error = '';

  register() {
    usersStore
      .register({
        username: this.username,
        email: this.email,
        password: this.password,
      })
      .then(() => this.$router.push('/login'))
      .catch((err) => {
        console.error(err);
        this.error = 'Wrong username or password.';
      });
  }
}

</script>

<style>

</style>
