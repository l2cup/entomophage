<template>
  <b-modal v-model="show" align="center" title="New Project" ok-title="Create project" @ok="createProject" @hide="cancelProjectCreation">
    <h3 class="mt-3 mb-2 text-secondary">{{this.message}}</h3>

    <b-form>
      <b-form-group
        id="input-group-1"
        label="Project Name:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="project.name"
          type="text"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Website:" label-for="input-2"> <b-form-input
          id="input-2"
          type="text"
          v-model="project.website"
          placeholder="Enter website"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="License:" label-for="input-3">
        <b-form-input
          id="input-3"
          type="text"
          v-model="project.license"
          placeholder="Enter license"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Team name:" label-for="input-4">
        <b-form-input
          id="input-4"
          type="text"
          v-model="project.teamName"
          placeholder="Enter your team name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="Description:" label-for="input-5">
        <b-form-textarea
          id="input-4"
          type="text"
          v-model="project.description"
          placeholder="Enter your project description"
          rows="3"
          required
          trim
        ></b-form-textarea>
      </b-form-group>
    </b-form>

  </b-modal>
</template>

<script lang="ts">
import {
  Vue, Component, PropSync,
} from 'vue-property-decorator';
import { ProjectModel } from '@entomophage/common/src';
import ProjectsModule from '../store/modules/projects';
import UserModule from '../store/modules/users';

@Component
export default class NewProjectModal extends Vue {
  project: ProjectModel = {} as ProjectModel

  message = ''

  @PropSync('showModal', { type: Boolean }) show!: boolean

  async createProject() {
    this.project.author = UserModule.user?.username as string;
    console.log(this.project);
    await ProjectsModule.new(this.project);
    this.project.name = `${this.project.author}/${this.project.name}`;
    await ProjectsModule.update(this.project);
  }

  cancelProjectCreation() {
    this.project = {} as ProjectModel;
  }
}

</script>

<style>

</style>
