<template>
  <b-container>
    <h2 class="mt-3 mb-2"> {{project.name}} </h2>
    <b-tabs pills align="left" class="mt-1">
      <b-tab title="Issues">
        <b-navbar toggleable="lg" type="light" variant="light" class="rounded mt-3 mb-3">
          <b-navbar-nav>
            <b-form-group
              label="Filter"
              label-cols-sm="3"
              label-align-sm="right"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm" >
                <b-form-input
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''" type="dark" variant="dark">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-button @click="showModal">New Issue</b-button>
          </b-navbar-nav>
        </b-navbar>
        <b-table
          :items="issues"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :filter="filter"
          :filterIncludedFields="filterOn"
          hover>
          <template v-slot:cell(state)="data">
            <p :class="data.value.color">{{data.value.text}}</p>
          </template>
          <template v-slot:cell(label)="data">
            {{IssueLabel[data.value]}}
          </template>
          <template v-slot:cell(edit)="row">
            <b-button size="sm" @click="edit(row.item, row.index, $event.target)" class="mr-1">
              Edit issue
            </b-button>
          </template>
          </b-table>
        </b-tab>
        <b-tab title="Details">

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
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-5" label="Description:" label-for="input-5">
              <b-form-textarea
                id="input-4"
                type="text"
                v-model="project.description"
                placeholder="Enter your project description"
                rows="3"
                trim
              ></b-form-textarea>
            </b-form-group>
          </b-form>
          <b-button
            v-on:click="updateProject"
            variant="primary"
            class="mt-2 mb-2"
          >Update project</b-button>
        </b-tab>
      </b-tabs>

      <b-modal :id="editModal.id" :title="editModal.title" @ok="updateIssue" ok-title="Update" align="center">

        <b-form-group id="input-group-modal-1" label="Issue name:" label-for="input-modal-1">
          <b-form-input
            id="input-modal-1"
            type="text"
            v-model="editModal.issueModel.name"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="select-group-modal-1" label="State:" label-for="select-modal-1">
          <b-form-select id="select-modal-1" v-model="editModal.issueModel.state" :options="stateValues" ></b-form-select>
        </b-form-group>
        <b-form-group id="select-group-modal-2" label="Label:" label-for="select-modal-2">
          <b-form-select id="select-modal-2" v-model="editModal.issueModel.label" :options="IssueLabel" ></b-form-select>
        </b-form-group>

      </b-modal>

      <NewIssueModal
        v-bind:showIssueModal.sync="showIssueModal"
        v-bind:issues.sync="issues"
        v-bind:stateValues="stateValues"
        v-bind:projectName="project.name"/>
    </b-container>
  </template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  ProjectModel, IssueModel, IssueLabel, IssueState,
} from '@entomophage/common';
import ProjectsModule from '../store/modules/projects';
import NewIssueModal from '../components/NewIssueModal.vue';
import IssuesModule from '../store/modules/issues';

@Component({ components: { NewIssueModal } })
export default class ProjectDetails extends Vue {
  private project: ProjectModel = {} as ProjectModel

  issues: IssueModel[] = []

  private IssueLabel = IssueLabel

  private sortBy = 'updatedAt'

  private sortDesc = true

  filter = ''

  private filterOn = ['name', 'state', 'updatedAt', 'label', 'issuedBy']

  showIssueModal = false

  fields = [
    {
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      filterByFormatted: true,
      formatter: (value: string, key: string, item: any) => new Date(value).toLocaleString('en-UK'),
    },
    { key: 'name', label: 'Name', sortable: false },
    { key: 'issuedBy', label: 'Opened by' },
    {
      key: 'state',
      sortable: true,
      formatter: (value: number, key: string, item: any) => this.stateValues[value],
      filterByFormatted: true,
    },
    'label', {
      key: 'edit', thStyle: { display: 'none' },
    }]

      private stateValues: IssueStateValue[] = [
        { text: 'Open', value: IssueState.OPEN, color: 'text-primary' },
        { text: 'Accepted', value: IssueState.ACCEPTED, color: 'text-info' },
        { text: 'In Progress', value: IssueState.IN_PROGRESS, color: 'text-warning' },
        { text: 'Resolved', value: IssueState.RESOLVED, color: 'text-success' },
        { text: 'Declined', value: IssueState.DECLINED, color: 'text-danger' },
      ]

      async mounted() {
        await ProjectsModule.fetchDetails(this.$route.query.name as string);
        this.project = ProjectsModule.detailed as ProjectModel;
        await IssuesModule.fetch(this.project?.name as string);
        this.issues = IssuesModule.issues;
      }

      async updateProject() {
        await ProjectsModule.update(this.project);
        await ProjectsModule.fetchDetails(this.project.name);
        this.project = ProjectsModule.detailed as ProjectModel;
      }

      async edit(item: IssueModel, index: number, button: any) {
        this.editModal.issueModel = item;
        this.$root.$emit('bv::show::modal', this.editModal.id, button);
      }

      async updateIssue() {
        await IssuesModule.update(this.editModal.issueModel);
        this.issues = IssuesModule.issues;
      }

      showModal() {
        this.showIssueModal = true;
      }

      editModal = {
        id: 'editModal',
        issueModel: {} as IssueModel,
        title: 'Edit issue',
      }
}

export type IssueStateValue = {
  text: string;
  value: number;
  color: string;
}

</script>
<style scoped>
</style>
