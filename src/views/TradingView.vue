<script>
import Transactor from "@/components/Transactor.vue";
import CardContainer from "@/components/CardContainer.vue";
import PriceChart from "@/components/PriceChart.vue";
import DepthChart from "@/components/DepthChart.vue";
import AssetDisplay from "@/components/AssetDisplay.vue";

export default {
  data() {
    return {
      selectedPair: "BTC/USDT",
      email: localStorage.getItem("email"),
      showTradingView: true,
    };
  },
  components: {
    CardContainer,
    Transactor,
    PriceChart,
    DepthChart,
    AssetDisplay
  },
  mounted () {
    document.getElementById("right-display").className = this.email ? "col-lg-3 col-sm-12 mb-3" : "col-lg-5 col-sm-12 mb-3"
  },
  methods: {
    handleCardSelected(pair) {
      this.selectedPair = pair.replace("-", "/");
    },
    displayTradingView(show) {
      this.showTradingView = show;
    },
  },
};
</script>

<template>
  <!-- <p>Hello, {{ email }}</p> -->
  <div class="row" style="width: 100%; height: 20%; margin: 0%">
    <CardContainer @selected="handleCardSelected" />
  </div>

  <div class="row section" style="width: 100%; margin: 0%">
    <div v-show="this.email" class="col-lg-2 col-sm-12 mb-3" style="justify-content: center;">
      <h4 class="center">Balance</h4>
      <div id="adisplay">
        <AssetDisplay />
      </div>
    </div>
    <div v-show="showTradingView" class="col-lg-7 col-sm-12 mb-3">
      <PriceChart :symbol="selectedPair.replace('/', '')" />
    </div>
    <div v-show="!showTradingView" class="col-lg-7 col-sm-12 mb-3">
      <DepthChart :symbol="selectedPair.replace('/', '')" />
    </div>
    <!-- <div class="col-lg-3 col-sm-12 mb-3"> -->
    <div id="right-display">
      <form class="card">
        <button @click="displayTradingView(true)" class="form-control btn" :class="{ 'btn-active': showTradingView }"
          type="button">
          Trading View
        </button>
        <button @click="displayTradingView(false)" class="form-control btn" :class="{ 'btn-active': !showTradingView }"
          type="button">
          Depth
        </button>
      </form>
      <Transactor :symbol="selectedPair" />

    </div>
  </div>
</template>

<style scoped>

@media (max-width: 1000px) {
  #adisplay {
    display: flex;
    justify-content: center;
  }
}
.card {
  margin-top: 0;
  padding-top: 0;
  border: 0;
}

.btn-active {
  background-color: rgba(255, 255, 255, 0);
  color: white;
  box-shadow: 0 0 4px white;
}

form .btn:focus,
form .btn:active,
form .btn:hover {
  background-color: rgba(255, 255, 255, 0);
  box-shadow: 0 0 4px white;
  color: white;
}
</style>
