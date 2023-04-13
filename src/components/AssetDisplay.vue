<script>
import { UserController } from "../server/controller/user.controller";


let userController = new UserController(
  localStorage.getItem("token"),
  localStorage.getItem("email")
);

export default {
  data() {
    return {
      profile: {},
      balance: {}
    };
  },
  async mounted() {
    this.profile = await this.callProfile()
    this.balance = this.profile['wallet']
    this.emitter.on("updateEvent", async update => {
      this.profile = await this.callProfile()
      this.balance = this.profile['wallet']
    })
  },
  methods: {
    getTokenUrl(token) {
      return new URL(`../assets/images/token/${token}.png`, import.meta.url).href;
    },
    toCapitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    async callProfile() {
      return userController
        .getUserData(localStorage.getItem("email"))
        .catch(() => {
          this.$router.push({ name: "login" });
        });
    },
  },
};
</script>
<template>
  <!-- <div class="card my-2" style="max-width: 200px;" v-for="(balance, token) in profile['wallet']" :key="balance">
    <div class="row">
      <div class="col center">
        <img :src="getTokenUrl(token)" alt="" class="token-icon" style="max-width: 30px; margin: 2%"/>
      </div>
      <div class="col center">
        {{ balance % 1 != 0 ? balance.toFixed(5) : balance }}
      </div>
    </div>
  </div> -->
  <div class="card my-2" style="max-width: 200px;" v-for="(balance, token) in this.balance" :key="balance">
    <div class="row">
      <div class="col center">
        <img :src="getTokenUrl(token)" alt="" class="token-icon" style="max-width: 30px; margin: 2%"/>
      </div>
      <div class="col center">
        {{ balance % 1 != 0 ? balance.toFixed(5) : balance }}
      </div>
    </div>
  </div>
</template>
