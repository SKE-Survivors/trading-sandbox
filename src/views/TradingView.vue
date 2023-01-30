<script>
import Transactor from "@/components/Transactor.vue";
import CardContainer from "@/components/CardContainer.vue";
import PriceChart2 from "@/components/PriceChart2.vue";

export default {
  data() {
    return {
      selectedPair: "BTC/USDT",
      email: localStorage.email,
    };
  },
  components: {
    CardContainer,
    Transactor,
    PriceChart2,
  },
  methods: {
    handleCardSelected(pair) {
      this.selectedPair = pair.replace("-", "/");
    },
  },
};
</script>

<template>
  <p>Hello, {{ email }}</p>
  <div class="row" style="width: 100%; height: 20%; margin: 0%">
    <CardContainer @selected="handleCardSelected" />
  </div>

  <div class="row section" style="width: 100%; margin: 0%">
    <div class="col-lg-9 col-sm-12 mb-3">
      <PriceChart2 :symbol="selectedPair.replace('/', '')" />
    </div>
    <div class="col-lg-3 col-sm-12 mb-3">
      <Transactor :symbol="selectedPair" />
    </div>
  </div>
</template>

<style scoped>
</style>
