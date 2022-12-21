<script>
import { UserController } from '../server/controller/user.controller'

let userController = new UserController(localStorage.token, localStorage.email)

export default {
  data() {
    return {
      profile: null,
      coin: null,
      order: null
    };
  },
  async created() {
    this.profile = await userController.getUserData()
  },
}

</script>

<template>
  <h1>This is profile page</h1>
  <p>Email: {{ profile["email"] }}</p>
  <p>Username: {{ profile["username"] }}</p>
  <p>Wallet: </p>
  <p v-for="coin, coinId in profile['wallet']" :key="coin">
  <p>{{ coinId }}: {{ coin }}</p>
  </p>
  <p>Orders: </p>
  <p v-for="order in profile['orders']" :key="order">
  <p>id: {{ order.id }} status: {{ order.status }} type: {{ order.type }} quote: {{ order.input_token }} value: {{ order.input_amount }} base: {{ order.output_token }} value: {{ order.output_amount }}</p>
  </p>

</template>
