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
    };
  },
  async mounted() {
    this.profile = await this.callProfile()
    this.emitter.on("updateEvent", async update => {
      this.profile = await this.callProfile()
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
    }
  },
};
</script>
<template>
  <h4 class="center">Balance</h4>
  <div class="card my-2" style="max-width: 200px;" v-for="(balance, token) in profile['wallet']" :key="balance">
    <div class="row">
      <div class="col center">
        <img :src="getTokenUrl(token)" alt="" class="token-icon" />
      </div>
      <div class="col center">
        {{ balance % 1 != 0 ? balance.toFixed(5) : balance }}
      </div>
    </div>
  </div>
</template>
