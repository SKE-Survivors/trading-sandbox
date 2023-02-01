<script>
import axios from "axios";
import Card from "@/components/Card.vue";

export default {
  components: {
    Card,
  },
  data() {
    return {
      pairs: null,
    };
  },
  async created() {
    const totalPair = await axios
      .get(import.meta.env.VITE_HOST + "/api/info/pairs")
      .catch((error) => {
        this.$router.push({
          name: "error",
          query: {
            err: "Our server is currently down at the moment, please come back later.",
          },
        });
      });
    this.pairs = totalPair["data"]["MESSAGE"];
  },
  methods: {
    emitPair(pair) {
      this.$emit("selected", pair);
    },
  },
};
</script>

<template>
  <div class="scroller py-3 px-1">
    <div class="col" v-for="pair in pairs" :key="pair">
      <Card :tradingCurrencies="pair" @click="emitPair(pair)" class="mx-1" />
    </div>
  </div>
</template>

<style scoped>
.scroller {
  overflow-x: scroll;
  display: flex;
}
</style>
