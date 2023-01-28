<script>
import { UserController } from "../../server/controller/user.controller";

let userController = new UserController();

export default {
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
        var res = await userController.signup(
          this.email,
          this.username,
          this.password,
          this.confirmPassword
        );
        localStorage.token = res;
        localStorage.email = this.email;
  
        // const storage = useStorage();
  
        // storage.clearStorageSync()
        // storage.setStorageSync("token", res)
        // console.log(storage.key())
        // this.$storage.clearStorageSync()
        // this.$storage.setStorageSync("token", res)
        // console.log(this.$storage.Key("ts_token"))
        this.$router.push("/");
      } catch (error) {
        let message = ""
        try {
          message = error["response"]["data"]["MESSAGE"]
        } catch (error) {
          message = "Our server is currently down at the moment, please come back later. We apologize for the inconvenience."
        }
        window.alert(message)
      }
    },
  },
};
</script>

<template>
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

      <button type="button" @click="sendForm()" class="form-control btn mt-5">Confirm</button>
      <small class="center">Already have an account? <router-link :to="{ name: 'login' }">Login</router-link></small>
    </form>
  </div>
</template>

<style scoped>
.card {
  margin: auto;
  width: 30%;
  min-width: 400px;
}
</style>
