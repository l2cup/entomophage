<template>
  <b-navbar toggleable="lg" type="dark" variant="primary">
    <b-navbar-brand v-if="userLoggedIn === false" :to="'/login'">
      <b-icon class="mr-1" icon="bookmarks"/> Entomophage</b-navbar-brand>
    <b-navbar-brand v-else :to="'/'"><b-icon class="mr-1" icon="bookmarks"/>
       Entomphage</b-navbar-brand>

     <b-navbar-toggle v-if="userLoggedIn === false" target="nav-collapse-t"></b-navbar-toggle>
     <b-navbar-toggle v-else target="nav-collapse-a"></b-navbar-toggle>

    <b-collapse v-if="userLoggedIn === false" id="nav-collapse-t" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :to="'/register'"><b-icon class="mr-2" icon="person-plus"/>
            Sign up</b-nav-item>
        <b-nav-item :to="'/login'"><b-icon class="mr-2" icon="box-arrow-in-right"/>
          Login</b-nav-item>
        <b-nav-item :to="'/about'"><b-icon class="mr-2" icon="people-fill"/> About</b-nav-item>
      </b-navbar-nav>
    </b-collapse>

    <b-collapse v-else id="nav-colapse-a" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item :to="'/profile'"><b-icon class="mr-2" icon="person-circle"/>
          Profile</b-nav-item>
        <b-nav-item :to="'/about'"><b-icon class="mr-2" icon="people-fill" /> About</b-nav-item>
        <b-nav-item v-on:click="logout()"><b-icon class="mr-2" icon="box-arrow-right"/> Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>

  </b-navbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UserModule from '../store/modules/users';

@Component
export default class Navbar extends Vue {
  get userLoggedIn() {
    return UserModule.user !== null;
  }

  async logout() {
    await UserModule.logout();
    this.$router.push('/login');
  }
}
</script>

<style>

</style>
