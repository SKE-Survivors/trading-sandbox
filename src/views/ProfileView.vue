<script>
import { UserController } from '../server/controller/user.controller'

let userController = new UserController(localStorage.token, localStorage.email)

export default {
  data() {
    return {
      profile: null,
    };
  },
  async created() {
    this.profile = await userController.getUserData()
  },
}

</script>

<template>
  <h1>This is profile page</h1>
  <p>{{ profile }}</p>
</template>
