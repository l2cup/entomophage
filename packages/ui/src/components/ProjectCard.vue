<template>

  <router-link :to="{path: 'project', query: {name: project.name}}" class="aii">
    <b-card class="box">

      <b-container class="box-title">
        <b-card-title>{{projectShortName}}</b-card-title>
        <b-card-sub-title>{{project.author}}</b-card-sub-title>
      </b-container>
      <b-container fluid class="box-text">
        <b-card-text>{{project.description}}</b-card-text>
      </b-container>
      <b-container class="left">
        <b-card-sub-title>{{project.license}}</b-card-sub-title>
      </b-container>

      <b-container class="right">
        <b-card-sub-title> {{project.teamName}}</b-card-sub-title>
      </b-container>

    </b-card>
  </router-link>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';
import { ProjectModel } from '@entomophage/common';

@Component
export default class ProjectCard extends Vue {
  @Prop() readonly project!: ProjectModel

  get projectShortName() {
    return this.project.name.split('/')[1];
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
  margin: 20px 0px;
  cursor: pointer;
  transition: all 0.5s ease-out;
}

.social-box .box:hover{
  box-shadow: 0 0 6px #78C2AD;
}

.social-box .box .box-text{
  margin:10px 0px;
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

.fa{
  color:#78C2AD;
}

.right {
  text-align:right;
  width: 49%;
  display: inline-block;
}

.left {
  text-align: left;
  width: 50%;
  display: inline-block;
}

</style>
