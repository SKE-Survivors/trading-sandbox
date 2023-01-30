<script>
import axios from "axios";
import { UserController } from "../server/controller/user.controller";

let userController = new UserController(
  localStorage.getItem("token"),
  localStorage.getItem("email")
);

export default {
  props: ["symbol"],
  data() {
    return {
      user: userController,
      transactionFlag: "Buy",
      type: "market",
      transaction: {
        // cuurency to paid
        quoteAsset: 0,
        // currency that will get
        baseAsset: 0,
        limit: 0,
        limit_amount: 0,
        totalSpent: 0,
      },
    };
  },
  methods: {
    resetAsset() {
      this.transaction.quoteAsset = 0;
      this.transaction.baseAsset = 0;
      this.transaction.limit = 0;
      this.transaction.limit_amount = 0;
      this.transaction.totalSpent = 0;
    },
    async rateDeterminer(currency) {
      const url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
      const res = await axios.get(url + currency.replace("/", "").toUpperCase());
      return res["data"]["lastPrice"];
    },
    async PreviewCoin(flag, currency, quoteAsset) {
      const rate = await this.rateDeterminer(currency);
      if (flag == "Buy") {
        this.transaction.baseAsset = (quoteAsset / Number(rate)).toFixed(5);
      } else if (flag == "Sell") {
        this.transaction.baseAsset = (quoteAsset * Number(rate)).toFixed(5);
      }
    },
    PreviewCoinWithLimit() {
      this.transaction.totalSpent = (
        this.transaction.limit_amount * this.transaction.limit
      ).toFixed(5);
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
    async commitTransaction(currency, flag, type) {
      const loader = document.querySelector("#loader");
      loader.style.display = "block";

      if (!localStorage.getItem("token")) {
        window.alert("Log in first to do transaction");
        return;
      }

      let limit = this.transaction.limit;
      let quoteAsset = this.transaction.quoteAsset;
      let baseAsset = this.transaction.baseAsset;

      if (flag === "Buy" && type != "market") {
        quoteAsset = this.transaction.totalSpent;
        baseAsset = this.transaction.limit_amount;
      }
      if (flag === "Sell" && type != "market") {
        quoteAsset = this.transaction.limit_amount;
        baseAsset = this.transaction.totalSpent;
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
      <img
        src="https://www.goldwell.com/content/dam/sites/kaousa/www-goldwell-com/content/master/global/goldwell-loader.gif"
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
        <select
          required
          name="type"
          v-model="type"
          @change="resetAsset"
          class="form-control input-field"
        >
          <option value="market">Market</option>
          <option value="limit">Limit</option>
          <option value="stop">Stop</option>
        </select>
      </div>
      <div class="col-4">
        <select
          required
          name="transaction-flag"
          @change="resetAsset"
          v-model="transactionFlag"
          class="form-control input-field"
        >
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
      </div>
    </div>
    <div v-if="type == 'market'">
      <label
        >{{ transactionFlag }}: {{ transaction.quoteAsset }}
        {{
          transactionFlag == "Buy" ? symbol.split("/")[1] : symbol.split("/")[0]
        }}</label
      >
      <input
        type="number"
        v-model.number="transaction.quoteAsset"
        @change="
          PreviewCoin(this.transactionFlag, this.symbol, this.transaction.quoteAsset)
        "
        class="form-control input-field"
      />
      <label
        >Got: {{ transaction.baseAsset }}
        {{
          transactionFlag == "Buy" ? symbol.split("/")[0] : symbol.split("/")[1]
        }}</label
      >
    </div>
    <div v-if="type != 'market'">
      <label>Price: {{ transaction.limit }} {{ symbol.split("/")[1] }}</label>
      <input
        type="number"
        v-model.number="transaction.limit"
        @change="PreviewCoinWithLimit()"
        class="form-control input-field"
      />
      <label>Amount: {{ transaction.limit_amount }} {{ symbol.split("/")[0] }}</label>
      <input
        type="number"
        v-model.number="transaction.limit_amount"
        @change="PreviewCoinWithLimit()"
        class="form-control input-field"
      />
      <label>Total: {{ transaction.totalSpent }} {{ symbol.split("/")[1] }}</label>
    </div>
    <button
      class="form-control btn"
      type="button"
      @click="
        commitTransaction(this.symbol.toLowerCase(), this.transactionFlag, this.type)
      "
    >
      Confirm
    </button>
  </form>
</template>

<style scoped>
.card {
  height: 100%;
  min-height: 70vh;
}

select {
  background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>")
    no-repeat;
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
