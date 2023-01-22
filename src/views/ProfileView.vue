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
  <div v-if="profile !== null">
    <h1>This is profile page</h1>
    <p>Email: {{ profile["email"] }}</p>
    <p>Username: {{ profile["username"] }}</p>
    <p>Wallet: </p>
    <p v-for="coin, coinId in profile['wallet']" :key="coin">
    <p>{{ coinId }}: {{ coin }}</p>
    </p>
    <p>Orders: </p>
    <p v-for="order in profile['orders']" :key="order">
      <p>id: {{ order.id }} status: {{ order.status }} type: {{ order.flag }} pair: {{order.pair_symbol}} quote: {{ order.input_amount }} base: {{ order.output_amount }}</p>
    </p>
  </div>
  <div v-if="profile == null">
    <p>Please log in to see this page.</p>
  </div>

</template>
