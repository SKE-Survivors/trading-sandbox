<script>
import Transactor from "@/components/Transactor.vue";
import CardContainer from "@/components/CardContainer.vue";
import PriceChart2 from "@/components/PriceChart2.vue";

export default {
  data() {
    return {
      selectedPair: "BTC/USDT",
      userController: this.user 
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
  props: [
    "user"
  ]
};
</script>


<template>
  <div class="row" style="width: 100%; height: 20%; margin: 0%">
    <CardContainer @selected="handleCardSelected"/>
  </div>

  <div class="row" style="width: 100%; margin: 0%">
    <div class="col">
      <PriceChart2 :symbol="selectedPair.replace('/', '')" />
    </div>
    <div class="col">
      <Transactor :symbol="selectedPair"/>
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
