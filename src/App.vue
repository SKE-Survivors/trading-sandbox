<script>
export default {
  data() {
    return {
      username: null,
    };
  },
  methods: {
    async reload() {
      this.username = localStorage.getItem('username');
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
};
</script>

<template>
  <nav class="menu">
    <h4 class="menu-item">
      <router-link :to="{ name: 'trading' }">TradingArena</router-link>
    </h4>

    <div class="menu-item dropdown" style="float: right;">
      <button class="dropdown-btn">
        {{ username || "Menu" }}<font-awesome-icon :icon="['fa', 'caret-down']" class="mx-2" />
      </button>

      <div class="dropdown-content" id="dropdown-content">
        <router-link v-show="username" class="form-control btn" :to="{ name: 'profile' }"
          >My Profile</router-link
        >
        <router-link class="form-control btn" :to="{ name: 'trading' }"
          >Trading</router-link
        >
        <router-link class="form-control btn" to="#">About us</router-link>
        <router-link class="form-control btn" to="#">Helps</router-link>
        <router-link v-show="!username" class="form-control btn" :to="{ name: 'login' }"
          >Login</router-link
        >
        <router-link v-show="username" class="form-control btn" :to="{ name: 'logout' }"
          >Logout</router-link
        >
      </div>
    </div>
  </nav>
  <router-view />
</template>

<style>
.dropdown {
  position: relative;
  display: inline-block;

  width: fit-content;
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

  right: 5%;
  width: 200%;
  margin-top: 2px;
}

.dropdown-content a:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
