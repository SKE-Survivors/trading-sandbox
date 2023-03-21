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
  async beforeCreate() {
    this.profile = await userController
      .getUserData(localStorage.getItem("email"))
      .catch(() => {
        this.$router.push({ name: "login" });
      });
  },
  methods: {
    getTokenUrl(token) {
      return new URL(`../assets/images/token/${token}.png`, import.meta.url).href;
    },
    toCapitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>
<template>
    <div
      class="inc card my-2"
      v-for="(balance, token) in profile['wallet']"
      :key="balance"
    >
      <div class="row">
        <div class="col v-center">
          <img :src="getTokenUrl(token)" alt="" class="token-icon" />
        </div>
        <div class="col v-center center">{{ balance }} {{ token.toUpperCase() }}</div>
        <div class="col v-center right">
          {{ profile["wallet_percent_change"][token].toFixed(2) }}%
        </div>
      </div>
    </div>
</template>
