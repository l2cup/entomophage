<template>
  <b-container>
    <h3 class="mt-3 mb-2 text-success">Profile Details</h3>
    <h3 class="mt-3 mb-2 text-secondary">{{this.message}}</h3>

    <b-form>
      <b-form-group
        id="input-group-1"
        label="Name:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="user.profile.name"
          type="text"
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Gender:" label-for="input-2"> <b-form-input
          id="input-2"
          type="text"
          v-model="user.profile.gender"
          placeholder="Enter gender"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Email:" label-for="input-3">
        <b-form-input
          id="input-3"
          type="email"
          v-model="user.email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Website:" label-for="input-4">
        <b-form-input
          id="input-4"
          type="text"
          v-model="user.profile.website"
          placeholder="Enter your website"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="Location:" label-for="input-5">
        <b-form-input
          id="input-5"
          type="text"
          v-model="user.profile.location"
          placeholder="Enter your location"
        ></b-form-input>
      </b-form-group>

      <b-button
        class="mt-4"
        v-on:click="updateUser"
        variant="primary"
      >Save changes</b-button>

    </b-form>
  </b-container>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { UserModel } from '@entomophage/common/src';
import UserModule from '../store/modules/users';

@Component
export default class ProfileDetails extends Vue {
  message = ''

  user = UserModule.user

  updateUser() {
    UserModule.update(this.user as UserModel)
      .then(() => this.message = 'Changes saved') // eslint-disable-line
      .catch((err) => {
        this.message = 'There was an error while saving';
        console.error(err);
      });
  }
}

</script>
<style scoped>

</style>
