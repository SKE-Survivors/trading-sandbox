<script>
import {SemipolarSpinner} from 'epic-spinners'
import { UserController } from "../../server/controller/user.controller";

let userController = new UserController();

export default {
  components: {
    SemipolarSpinner
    },
  data() {
    return {
      email: null,
      username: null,
      password: null,
      confirmPassword: null,
    };
  },
  methods: {
    async sendForm() {
      try {
        const loader = document.querySelector('#loader')
        loader.style.display = 'block'
        var res = await userController.signup(
          this.email,
          this.username,
          this.password,
          this.confirmPassword
        );
        localStorage.setItem('token', res);
        localStorage.setItem('email', this.email);
        localStorage.setItem('username', this.username);
        loader.style.display = 'none'
        this.$router.push("/");
      } catch (error) {
        let message = ""
        try {
          message = error["response"]["data"]["MESSAGE"]
        } catch (error) {
          message = "Our server is currently down at the moment, please come back later. We apologize for the inconvenience."
        }
        loader.style.display = 'none'
        window.alert(message)
      }
    },
  },
};
</script>

<template>
  <div id="loader">
    <div id="loader-content">
      <semipolar-spinner
              :animation-duration="2000"
              :size="100"
              :color="'#b47ee5'"
         />
    </div>
  </div>
  <div class="container">
    <form class="card my-5">
      <h1>Sign up</h1>

      <label for="email">Email</label>
      <input type="text" id="email" name="email" v-model="email" class="form-control input-field"/>

      <label for="username">Username</label>
      <input type="text" id="username" name="username" v-model="username" class="form-control input-field"/>

      <label for="pwd">Password</label>
      <input type="password" id="pwd" name="pwd" v-model="password" class="form-control input-field"/>
      
      <label for="cpwd">Confirm Password</label>
      <input type="password" id="cpwd" name="cpwd" v-model="confirmPassword" class="form-control input-field"/>

      <button type="button" @click="sendForm()" class="form-control btn mt-4">Confirm</button>
      <small class="center" style="margin-top: 7px;">Already have an account? <router-link :to="{ name: 'login' }">Login</router-link></small>
    </form>
  </div>
</template>

<style scoped>
.card {
  margin: auto;
  width: 30%;
  min-width: 400px;
}

#loader {
  display: none; 
  position: fixed; 
  z-index: 1; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto;
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 

}

#loader-content {
  margin: 15% auto; 
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
