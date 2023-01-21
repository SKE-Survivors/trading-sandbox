<script>
</script>
<template>
  <nav class="menu">
    this is menu ->
    <router-link to="/">Trading</router-link> |
    <router-link :to="{ name: 'profile' }">Profile</router-link> |
    <router-link :to="{ name: 'signup'}">Signup</router-link> |
    <router-link :to="{ name: 'login'}">Login</router-link>
  </nav>
  <router-view />
</template>

<style>
/* app main style */
</style>
