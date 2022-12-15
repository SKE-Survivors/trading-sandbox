<template>
  <nav>
    this is menu ->
    <router-link to="/">Trading</router-link> |
    <router-link :to="{ name: 'about' }">About</router-link>
  </nav>
  <router-view />
</template>

<style>
/* app main style */
</style>
