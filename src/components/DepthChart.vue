<template>
  <div class="chart" id="depthchart"></div>
</template>

<script>
export default {
  props: ["symbol"],
  data() {
    return {
      ws: null,
    };
  },
  mounted() {
    this.loadChart(this.symbol);
  },
  watch: {
    symbol() {
      this.loadChart(this.symbol);
    },
  },
  methods: {
    updateData(e) {
      let data = JSON.parse(e.data) || {};
      // console.log(data);

      let asksData = data.asks.map((v) => [parseFloat(v[0]), parseFloat(v[1])]);
      let bidsData = data.bids.map((v) => [parseFloat(v[0]), parseFloat(v[1])]);
      let midmarket = (asksData[0][0] + bidsData[0][0]) / 2;

      zingchart.exec("depthchart", "setdata", {
        data: {
          "background-color": "#171b26",
          type: "depth",
          options: {
            midMarketPrice: midmarket,
            mmpMarker: {
              alpha: 0.75,
              // lineColor: "#999",
              label: {
                color: "#fff",
                fontSize: 12,
                offsetY: 20,
              },
            },
            // currency: "$",
            palette: ["#f13645", "#019a81"],
            title: {
              color: "#fff",
              // text: "title",
            },
            subtitle: {
              visible: true,
              text: this.symbol.toUpperCase(),
            },
          },
          series: [
            {
              values: asksData,
              text: "Asks",
            },
            {
              values: bidsData,
              text: "Bids",
            },
          ],
        },
      });
    },
    async loadChart(symbol) {
      if (this.ws != null) {
        this.ws.removeEventListener("message", this.updateData);
      }
      this.ws = new WebSocket(
        "wss://stream.binance.com:9443/ws/" + symbol.toLowerCase() + "@depth20"
      );
      this.ws.addEventListener("message", this.updateData);

      zingchart.exec("depthchart", "destroy");
      zingchart.render({
        id: "depthchart",
        height: "100%",
        data: {
          "background-color": "#171b26",
          type: "depth",
          options: {
            title: {
              color: "#fff",
              text: " Loading... ",
            },
            subtitle: {
              visible: true,
              text: this.symbol.toUpperCase(),
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart {
  height: 100%;
  min-height: 75vh;
}
</style>
