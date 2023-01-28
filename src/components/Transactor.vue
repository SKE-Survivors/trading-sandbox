<script>
import axios from "axios";
import { UserController } from "../server/controller/user.controller";

let userController = new UserController(localStorage.token, localStorage.email)

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
        totalSpent: 0
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
      const res = await axios.get(
        url + currency.replace("/", "").toUpperCase()
      );
      return res["data"]["lastPrice"];
    },
    async PreviewCoin(flag, currency, quoteAsset) {
      console.log(flag + " " + currency + " for " + quoteAsset);

      const rate = await this.rateDeterminer(currency);
      if (flag == "Buy") {
        this.transaction.baseAsset = (quoteAsset / Number(rate)).toFixed(5);
      } else if (flag == "Sell") {
        this.transaction.baseAsset = (quoteAsset * Number(rate)).toFixed(5);
      }
    },
    PreviewCoinWithLimit(flag, limit = this.transaction.limit, limit_amount = this.transaction.limit_amount) {
      console.log(flag + " with limit: " + limit + " amount: " + limit_amount);

      this.transaction.limit = limit
      this.transaction.limit_amount = limit_amount
      this.transaction.totalSpent = (this.transaction.limit_amount * this.transaction.limit).toFixed(5);

    },
    async updateTransaction(
      flag,
      currency,
      balance,
      quoteAsset,
      baseAsset,
      quoteCurrency,
      baseCurrency,
      type,
      limit
    ) {
      console.log({
        currency: currency,
        quote: quoteAsset,
        base: baseAsset,
      });
      if (type == "market") {

        await this.user.updateUserBalance(
          quoteCurrency,
          Number(balance[quoteCurrency]) - Number(quoteAsset)
        );
        await this.user.updateUserBalance(
          baseCurrency,
          Number(balance[baseCurrency]) + Number(baseAsset)
        );
      }
      if (type == "stop") {
        await this.user.sendTrigger(flag, currency, Number(quoteAsset), Number(baseAsset), limit)
      } else {
        let status = "finished"
        if (type == "limit") {
          status = "active"
        }
        await this.user.addUserTransaction(
          status,
          flag,
          currency,
          Number(quoteAsset),
          Number(baseAsset)
        );
      }
      this.balance = await this.user.getBalance();
    },
    async commitTransaction(currency, flag, type) {
      try {
        const baseQuoteCurrencies = currency.split("/");
          const balance = await this.user.getBalance();

          let quoteCurrency, baseCurrency;
          let limit = this.transaction.limit
          let quoteAsset = this.transaction.quoteAsset
          let baseAsset = this.transaction.baseAsset

          if (flag === "Buy") {
            quoteCurrency = baseQuoteCurrencies[1];
            baseCurrency = baseQuoteCurrencies[0];
            if (type != "market") {
              quoteAsset = this.transaction.totalSpent
              baseAsset = this.transaction.limit_amount
            }
          } else if (flag === "Sell") {
            quoteCurrency = baseQuoteCurrencies[0];
            baseCurrency = baseQuoteCurrencies[1];
            if (type != "market") {
              quoteAsset = this.transaction.limit_amount
              baseAsset = this.transaction.totalSpent
            }
          }

          if (balance[quoteCurrency] >= quoteAsset) {
            this.updateTransaction(
              flag,
              currency.replace("/", "-"),
              balance,
              quoteAsset,
              baseAsset,
              quoteCurrency,
              baseCurrency,
              type,
              limit
            );
          } else {
            console.log("Not enough funds!!!");
          }

          console.log(await this.user.getBalance());
          this.resetAsset();
      } catch (error) {
        window.alert("Our server is currently down at the moment, please come back later. We apologize for the inconvenience.")
      }

      if (balance[quoteCurrency] >= quoteAsset) {
        this.updateTransaction(
          flag,
          currency.replace("/", "-"),
          balance,
          quoteAsset,
          baseAsset,
          quoteCurrency,
          baseCurrency,
          type,
          limit
          );
        } else {
        console.log("Not enough funds!!!");
      }

      console.log(await this.user.getBalance());
      this.resetAsset();
    },
    getTokenUrl(n) {
      let currencies = this.symbol.toLowerCase().split("/");
      return new URL(`../assets/images/token/${currencies[n]}.png`, import.meta.url).href;
    },
  }
};
</script>

<template>
  <form class="card">
    <div class="title my-2">
      <img :src="getTokenUrl(0)" alt="" class="token-icon v-center" />
      <h5 class="v-center">{{ symbol.toUpperCase() }}</h5>
      <!-- <img :src="getTokenUrl(1)" alt="" class="token-icon" /> -->
    </div>
    <div class="row mt-1">
      <div class="col-8" style="padding-right:0;">
        <select required name="type" v-model="type" @change="resetAsset" class="form-control input-field">
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
        @change="PreviewCoinWithLimit(this.transactionFlag, this.transaction.limit)"
        class="form-control input-field"
      />
      <label>Amount: {{ transaction.limit_amount }} {{ symbol.split("/")[0] }}</label>
      <input
        type="number"
        v-model.number="transaction.limit_amount"
        @change="
          PreviewCoinWithLimit(this.transactionFlag, (limit_amount = this.limit_amount))
        "
        class="form-control input-field"
      />
      <label>Total: {{ transaction.totalSpent }} {{ symbol.split("/")[1] }}</label>
    </div>
    <button
      class="form-control btn"
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
</style>
