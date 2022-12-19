<script>
import {UserController} from "../../server/controller/user.controller"

let userController = new UserController()

export default {
  data() {
    return {
      email: null,
      password: null,
    }
  },
  methods: {
    async sendForm() {
      console.log("AAAA")
      let res = await userController.login(this.email, this.password)
      localStorage.token = res
      localStorage.email = this.email
      this.$router.push('/') 
    }
  }
}

</script>
<template>
  <h1>This is a login page</h1>
  <div>
    <form>
      <label for="email">Email:</label><br>
      <input type="text" id="email" name="email" v-model="email"><br>
      <label for="pwd">Password:</label><br>
      <input type="password" id="pwd" name="pwd" v-model="password"><br>
      <br>
      <button type="button" @click="sendForm()">Confirm</button>
    </form>
  </div>
</template>