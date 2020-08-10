<template>
  <b-container class="social-box">

    <h2 class="mt-5 text-secondary">What is entomophage</h2>
    <h3>Entomophage is a bug and issue tracker.</h3>

    <b-row class="cols-md-1 mt-5" cols="1">
      <b-col class="col-md-12 text-center">
        <a href="mailto:nikolic.uros@me.com" class="aii">
          <b-card class="box">
            <i class="fa fa-behance fa-3x" aria-hidden="true"></i>
            <b-container class="box-title">
              <b-card-title>Contact Us</b-card-title>
            </b-container>
            <b-container fluid class="box-text">
              <b-card-text>For more information please contact the entomphage team.</b-card-text>
            </b-container>
            <b-container class="box-btn">
              <a href="mailto:nikolic.uros@me.com" class="text-primary">Contact</a>
            </b-container>
          </b-card>
        </a>
      </b-col>
    </b-row>
  </b-container>
</template>

<style scoped>

body{
  background: #f2f2f2;
}

.social-box .box{
  background: #FFF;
  border-radius: 10px;
  padding: 40px 10px;
  margin: 20px 0px;
  cursor: pointer;
  transition: all 0.5s ease-out;
}

.social-box .box:hover{
  box-shadow: 0 0 6px #78C2AD;
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

.fa{
  color:#78C2AD;
}
</style>
