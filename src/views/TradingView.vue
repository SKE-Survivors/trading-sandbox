<script>
import Transactor from "@/components/Transactor.vue";
import CardContainer from "@/components/CardContainer.vue";
import PriceChart2 from "@/components/PriceChart2.vue";

export default {
  data() {
    return {
      selectedPair: "BTCUSDT",
    };
  },
  components: {
    CardContainer,
    Transactor,
    PriceChart2,
  },
  methods: {
    handleCardSelected(pair) {
      this.selectedPair = pair.replace("-", "");
    },
  },
};
</script>


<template>
  <div class="row" style="width: 100%; height: 20%; margin: 0%">
    <CardContainer @selected="handleCardSelected" />
  </div>

  <div class="row" style="width: 100%; margin: 0%">
    <div class="col">
      <PriceChart2 :symbol="selectedPair" />
    </div>
    <div class="col">
      <Transactor />
    </div>
  </div>
</template>

<style scoped>
.chart {
  position: absolute;
  width: 50%;
  height: 50%;
}
</style>
