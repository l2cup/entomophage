<template>
  <b-container fluid="md">

    <b-card class="mt-5" no-body>
      <b-tabs vertical pills card>
        <b-tab title="Details">
          <ProfileDetails />
        </b-tab>
        <b-tab title="Security" disabled>
        </b-tab>
        <b-tab title="Developer" disabled>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import ProfileDetails from '../components/ProfileDetails.vue';

@Component({ components: { ProfileDetails } })
export default class Profile extends Vue {

}
</script>

<style>

</style>
