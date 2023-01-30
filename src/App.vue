<script>
import { UserController } from "./server/controller/user.controller";

export default {
  data() {
    return {
      profile: null,
    };
  },
  methods: {
    async reload() {
      let controller = new UserController(localStorage.token, localStorage.email);
      this.profile = await controller.getUserData(localStorage.email)
    },
  },
  async mounted() {
    this.reload();
  },
  watch: {
    async $route(to, from) {
      this.reload();
    },
  },
  computed: {
    username() {
      if (this.profile) {
        return this.profile["username"];
      }
      return null;
    },
  },
};
</script>

<template>
  <nav class="menu">
    <h4 class="menu-item">
      <router-link :to="{ name: 'trading' }">TradingArena</router-link>
    </h4>

    <div class="menu-item dropdown" style="float: right">
      <button class="dropdown-btn">{{ username || "Menu"}}<font-awesome-icon :icon="['fa', 'caret-down']" class="mx-2" /></button>

      <div class="dropdown-content" id="dropdown-content">
        <router-link v-show="profile" class="form-control btn" :to="{ name: 'profile' }">My Profile</router-link>
        <router-link class="form-control btn" :to="{ name: 'trading' }">Trading</router-link>
        <router-link class="form-control btn" to="#">About us</router-link>
        <router-link class="form-control btn" to="#">Helps</router-link>
        <router-link v-show="!profile" class="form-control btn" :to="{ name: 'login' }">Login</router-link>
        <router-link v-show="profile" class="form-control btn" :to="{ name: 'logout' }">Logout</router-link>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<style>
.dropdown {
  position: relative;
  display: inline-block;

  min-width: 20%;
  max-width: 25%;
  text-align: right;
}

.dropdown-btn {
  background-color: inherit;
  color: inherit;
  font-size: inherit;
  border: inherit;
}

.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1;

  background-color: rgba(255, 255, 255, 0.9);
  color: var(--dark-text-color);
  border-radius: 8px;

  right: 0;
  width: 100%;
  margin-top: -24px;
}

.dropdown-content a:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
