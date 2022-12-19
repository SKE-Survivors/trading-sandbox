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
    const totalPair = await axios.get(import.meta.env.VITE_HOST+"/api/info/pairs");
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
  <div class="col scroller">
    <div class="col" v-for="pair in pairs" :key="pair">
      <Card :tradingCurrencies="pair" :symbol="'◑'" @click="emitPair(pair)" />
    </div>
  </div>
</template>

<style scoped>
.scroller {
  overflow-x: scroll;
  display: flex;
}
</style>
