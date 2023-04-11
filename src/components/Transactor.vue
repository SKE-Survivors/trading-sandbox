<script>
import axios from "axios";
import {SemipolarSpinner} from 'epic-spinners'
import { UserController } from "../server/controller/user.controller";

let userController = new UserController(
  localStorage.getItem("token"),
  localStorage.getItem("email")
);

export default {
  components: {
    SemipolarSpinner
    },
  props: ["symbol"],
  data() {
    return {
      user: userController,
      transactionFlag: "Buy",
      type: "market",
      transactionQuoteAsset: 0, // cuurency to paid
      transactionLimit: 0,
      transactionLimitAmount: 0,
      symbolRate: 1,
    };
  },
  computed: {
    transactionBaseAsset() {
      let quoteAsset = this.transactionQuoteAsset;
      let rate = this.symbolRate;

      let baseAsset = 0;
      if (this.transactionFlag == "Buy") {
        baseAsset = (quoteAsset / Number(rate)).toFixed(5);
      } else {
        baseAsset = (quoteAsset * Number(rate)).toFixed(5);
      }
      return baseAsset;
    },
    transactionTotalSpent() {
      return (this.transactionLimitAmount * this.transactionLimit).toFixed(5);
    },
  },
  methods: {
    resetAsset() {
      this.transactionQuoteAsset = 0;
      this.transactionLimit = 0;
      this.transactionLimitAmount = 0;
    },
    async updateSymbolRate() {
      const url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
      const res = await axios.get(url + this.symbol.replace("/", "").toUpperCase());
      this.symbolRate = res["data"]["lastPrice"];
    },
    async updateTransaction(flag, currency, quoteAsset, baseAsset, type, limit) {
      loader.style.display = "none";
      let response_msg;

      try {
        if (type == "stop") {
          response_msg = await this.user.sendTrigger(
            localStorage.getItem("email"),
            localStorage.getItem("token"),
            flag.toLowerCase(),
            currency,
            Number(quoteAsset),
            Number(baseAsset),
            limit
          );
          window.alert(response_msg);
          return;
        }

        let status = type == "limit" ? "active" : "finished";
        response_msg = await this.user.addUserTransaction(
          localStorage.getItem("email"),
          localStorage.getItem("token"),
          status,
          flag.toLowerCase(),
          currency,
          Number(quoteAsset),
          Number(baseAsset)
        );
        window.alert(response_msg);
      } catch (error) {
        try {
          window.alert(error["response"]["data"]["MESSAGE"]);
        } catch (error) {
          window.alert(
            "Our server is currently down at the moment, please come back later. We apologize for the inconvenience."
          );
        }
      }
    },
    async commitTransaction() {
      let currency = this.symbol.toLowerCase();
      let flag = this.transactionFlag;
      let type = this.type;

      const loader = document.querySelector("#loader");
      loader.style.display = "block";

      if (!localStorage.getItem("token")) {
        loader.style.display = "none";
        window.alert("Log in first to do transaction");
        return;
      }

      let limit = this.transactionLimit;
      let quoteAsset = this.transactionQuoteAsset;
      let baseAsset = this.transactionBaseAsset;

      if (flag === "Buy" && type != "market") {
        quoteAsset = this.transactionTotalSpent;
        baseAsset = this.transactionLimitAmount;
      }
      if (flag === "Sell" && type != "market") {
        quoteAsset = this.transactionLimitAmount;
        baseAsset = this.transactionTotalSpent;
      }

      this.updateTransaction(
        flag,
        currency.replace("/", "-"),
        quoteAsset,
        baseAsset,
        type,
        limit
      );
      this.resetAsset();
      this.emitter.emit("updateEvent")
    },
    getTokenUrl(n) {
      let currencies = this.symbol.toLowerCase().split("/");
      return new URL(`../assets/images/token/${currencies[n]}.png`, import.meta.url).href;
    },
  },
};
</script>

<template>
  <div id="loader">
    <div id="loader-content">
      <!-- <img
        src="https://www.goldwell.com/content/dam/sites/kaousa/www-goldwell-com/content/master/global/goldwell-loader.gif" /> -->
        <semipolar-spinner
              :animation-duration="2000"
              :size="100"
              :color="'#b47ee5'"
         />
    </div>
  </div>
  <form class="card">
    <div class="title my-2">
      <img :src="getTokenUrl(0)" alt="" class="token-icon v-center" />
      <h5 class="v-center">{{ symbol.toUpperCase() }}</h5>
      <!-- <img :src="getTokenUrl(1)" alt="" class="token-icon" /> -->
    </div>
    <div class="row mt-1">
      <div class="col-8" style="padding-right: 0">
        <select required name="type" v-model="type" @change="resetAsset" class="form-control input-field">
          <option value="market">Market</option>
          <option value="limit">Limit</option>
          <option value="stop">Stop</option>
        </select>
      </div>
      <div class="col-4">
        <select required name="transaction-flag" @change="resetAsset" v-model="transactionFlag"
          class="form-control input-field">
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
      </div>
    </div>
    <div v-if="type == 'market'">
      <label>{{ transactionFlag }}: {{ transactionQuoteAsset }}
        {{
  transactionFlag == "Buy" ? symbol.split("/")[1].toUpperCase() : symbol.split("/")[0].toUpperCase()
        }}</label>
      <input type="number" v-model.number="transactionQuoteAsset" @change="updateSymbolRate()"
        class="form-control input-field" />
      <label>Receive: {{ transactionBaseAsset == 0 ? "0" : transactionBaseAsset }}
        {{
  transactionFlag == "Buy" ? symbol.split("/")[0].toUpperCase() : symbol.split("/")[1].toUpperCase()
        }}</label>
    </div>
    <div v-if="type != 'market'">
      <label>Limit: {{ transactionLimit }} {{ symbol.split("/")[1].toUpperCase() }}</label>
      <input type="number" v-model.number="transactionLimit" class="form-control input-field" />
      <label>{{ transactionFlag }}: {{ transactionLimitAmount }} {{ symbol.split("/")[0].toUpperCase() }}</label>
      <input type="number" v-model.number="transactionLimitAmount" class="form-control input-field" />
      <label>Total: {{ transactionTotalSpent == 0 ? "0" : transactionTotalSpent}} {{ symbol.split("/")[1].toUpperCase() }}</label>
    </div>
    <button class="form-control btn" type="button" @click="commitTransaction()">
      Confirm
    </button>
  </form>
</template>

<style scoped>
.card {
  height: fit-content;
  min-height: 70vh;
}

select {
  background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>") no-repeat;
  background-position: calc(100% - 0.75rem) center !important;
}

.title {
  text-align: center;
  height: 60px;
}

.title img,
.title h5 {
  vertical-align: middle;
  display: inline-block;
  margin: 0 4px;
}

#loader {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

#loader-content {
  margin: 15% auto;
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
