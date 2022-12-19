<script>
import {UserController} from "../../server/controller/user.controller"

let userController = new UserController()

export default {
  data() {
    return {
      email: null,
      username: null,
      password: null,
      confirmPassword: null
    }
  },
  methods: {
    async sendForm() {
      var res = await userController.signup(this.email, this.username, this.password, this.confirmPassword)
      localStorage.token = res
      localStorage.email = this.email
      
      // const storage = useStorage();

      // storage.clearStorageSync()
      // storage.setStorageSync("token", res)
      // console.log(storage.key())
      // this.$storage.clearStorageSync()
      // this.$storage.setStorageSync("token", res)
      // console.log(this.$storage.Key("ts_token"))
      this.$router.push('/') 
    }
  }
}

</script>
<template>
  <h1>This is signup page</h1>
  <div>
    <form>
      <label for="email">Email:</label><br>
      <input type="text" id="email" name="email" v-model="email"><br>
      <label for="username">Username:</label><br>
      <input type="text" id="username" name="username" v-model="username"><br>
      <label for="pwd">Password:</label><br>
      <input type="password" id="pwd" name="pwd" v-model="password"><br>
      <label for="cpwd">Confirm Password:</label><br>
      <input type="password" id="cpwd" name="cpwd" v-model="confirmPassword"><br>
      <br>
      <button type="button" @click="sendForm()">Confirm</button>
    </form>
  </div>
</template>
