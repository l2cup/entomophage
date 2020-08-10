<template>
  <b-modal v-model="showModal" align="center" title="New Issue" ok-title="Create issue"
    @ok="createIssue" @hide="cancelIssueCreation">
    <h3 class="mt-3 mb-2 text-secondary">{{this.message}}</h3>

    <b-form-group id="input-group-modal-1" label="Issue name:" label-for="input-modal-1">
      <b-form-input
        id="input-modal-1"
        type="text"
        v-model="issue.name"
      ></b-form-input>
    </b-form-group>

    <b-form-group id="select-group-modal-1" label="State:" label-for="select-modal-1">
      <b-form-select id="select-modal-1" v-model="issue.state" :options="stateValues" ></b-form-select>
    </b-form-group>
    <b-form-group id="select-group-modal-2" label="Label:" label-for="select-modal-2">
      <b-form-select id="select-modal-2" v-model="issue.label" :options="IssueLabel" ></b-form-select>
    </b-form-group>

  </b-modal>
</template>

<script lang="ts">
import {
  Vue, Component, PropSync, Prop,
} from 'vue-property-decorator';
import { IssueModel, IssueLabel } from '@entomophage/common/src';
import UserModule from '../store/modules/users';
import IssuesModule from '../store/modules/issues';
import { IssueStateValue } from '../views/ProjectDetails.vue';

@Component
export default class NewProjectModal extends Vue {
  @Prop() readonly projectName!: string

  @Prop() readonly stateValues!: IssueStateValue[]

  private issue: IssueModel = {} as IssueModel

  private IssueLabel = IssueLabel

  private message = ''

  @PropSync('showIssueModal', { type: Boolean }) showModal!: boolean

  @PropSync('issues') propIssues!: IssueModel[]

  async createIssue() {
    this.issue.issuedBy = UserModule.user?.username as string;
    this.issue.project = this.projectName;
    console.log(this.issue);
    await IssuesModule.new(this.issue);
    await IssuesModule.fetch(this.projectName);
    this.propIssues = IssuesModule.issues;
  }

  cancelIssueCreation() {
    this.issue = {} as IssueModel;
  }
}

</script>

<style>

</style>
