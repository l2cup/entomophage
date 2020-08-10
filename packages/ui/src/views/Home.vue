<template>
  <b-container class="home">
    <b-tabs pills class="mt-3 mb-3" align="center">
      <b-tab title="My projects">
        <b-container class="social-box">
          <b-row class="cols-md-1 mt-5" cols=1>
            <b-col v-for="project in projects" :key="project.name" class="col-md-4 text-center">
              <ProjectCard v-bind:project="project"/>
            </b-col>
          </b-row>
        </b-container>
      </b-tab>
      <b-tab pills title="All projects" disabled>
      </b-tab>
      <b-tab pills title="Popular projects" disabled>
      </b-tab>

      <template v-slot:tabs-end>
        <b-button @click="newProject">New project</b-button>
      </template>
    </b-tabs>

    <NewProjectModal v-bind:showModal.sync="showModal" />

  </b-container>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component } from 'vue-property-decorator';
import ProjectCard from '../components/ProjectCard.vue';
import NewProjectModal from '../components/NewProjectModal.vue';

import UserModule from '../store/modules/users';
import ProjectsModule from '../store/modules/projects';

@Component({ components: { ProjectCard, NewProjectModal } })
export default class Home extends Vue {
  showModal = false

  get user() {
    return UserModule.user;
  }

  get projects() {
    if (UserModule.user != null) {
      if (ProjectsModule.projects.length === 0) {
        ProjectsModule.fetch(UserModule.user?.username);
      }
      return ProjectsModule.projects;
    }
    return [];
  }

  newProject() {
    this.showModal = true;
  }
}

</script>

<style scoped>

body{
  background: #f2f2f2;
}

.social-box .box{
  background: #FFF;
  border-radius: 10px;
  padding: 0px 0px;
  margin: 20px 0px;
  cursor: pointer;
  transition: all 0.5s ease-out;
}

.social-box .box:hover{
  box-shadow: 0 0 7px #78C2AD;
}

.social-box .box .box-text{
  margin:20px 0px;
  font-size: 15px;
  line-height: 30px;
}

.social-box .box .box-btn a{
  text-decoration: inherit;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
}

.aii {
  text-decoration: inherit;
  color: inherit;
  cursor: pointer;
}

.right {
  text-align:right;
  width: 25%;
  display: inline-block;

}

.left {
  text-align: left;
  width: 25%;
  display: inline-block;

}
.fa{
  color:#78C2AD;
}
</style>
