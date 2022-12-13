<script>
import Transactor from "./components/Transactor.vue";
import CardContainer from "./components/CardContainer.vue";
import PriceChart from "./components/PriceChart.vue";

export default {
  components: {
    CardContainer,
    Transactor,
    PriceChart,
  },
};
</script>

<template>
  <div class="row" style="width: 100%; height: 20%; margin: 0%">
    <CardContainer />
  </div>

  <div class="row" style="width: 100%; margin: 0%">
    <div class="col">
      <PriceChart />
    </div>
    <div class="col">
      <Transactor />
    </div>
  </div>
</template>

<style scoped>
</style>
