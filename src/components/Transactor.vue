<script>
import axios from "axios";

// todo: use APIs instead
import { UserController } from "../server/controller/user.controller";

let userController = new UserController("config");

const user = await userController.getUserData(9281);
const balance = await userController.getBalance(9281);

export default {
  data() {
    return {
      userId: user["id"],
      username: user["username"],
      balance: balance,
      user: userController,
      transactionFlag: "Buy",
      transaction: {
        currency: "btc-usdt",
        // cuurency to paid
        quoteAsset: 0,
        // currency that will get
        baseAsset: 0,
      },
    };
  },
  methods: {
    resetAsset() {
      this.transaction.quoteAsset = 0;
      this.transaction.baseAsset = 0;
    },
    async rateDeterminer(currency) {
      const url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
      const res = await axios.get(
        url + currency.replace("-", "").toUpperCase()
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
    async updateTransaction(
      flag,
      currency,
      balance,
      quoteAsset,
      baseAsset,
      quoteCurrency,
      baseCurrency
    ) {
      console.log({
        currency: currency,
        quote: quoteAsset,
        base: baseAsset,
      });
      await this.user.updateUserBalance(
        this.userId,
        quoteCurrency,
        Number(balance[quoteCurrency]["amount"]) - Number(quoteAsset)
      );
      await this.user.updateUserBalance(
        this.userId,
        baseCurrency,
        Number(balance[baseCurrency]["amount"]) + Number(baseAsset)
      );
      await this.user.addUserTransaction(
        this.userId,
        flag,
        currency,
        Number(quoteAsset),
        Number(baseAsset)
      );
      this.balance = await this.user.getBalance(this.userId);
    },
    async commitTransaction(currency, quoteAsset, baseAsset, flag) {
      const baseQuoteCurrencies = currency.split("-");
      const balance = this.balance;

      let quoteCurrency, baseCurrency;
      if (flag === "Buy") {
        quoteCurrency = baseQuoteCurrencies[1];
        baseCurrency = baseQuoteCurrencies[0];
      } else if (flag === "Sell") {
        quoteCurrency = baseQuoteCurrencies[0];
        baseCurrency = baseQuoteCurrencies[1];
      }

      this.resetAsset();

      if (balance[quoteCurrency]["amount"] >= quoteAsset) {
        this.updateTransaction(
          flag,
          currency,
          balance,
          quoteAsset,
          baseAsset,
          quoteCurrency,
          baseCurrency
        );
      } else {
        console.log("Not enough funds!!!");
      }

      console.log(await this.user.getBalance(this.userId));
    },
  },
};
</script>

<template>
  <div id="transactor">
    <select required name="transaction.currency" v-model="transaction.currency">
      <option value="btc-usdt">BTC/USDT</option>
      <option value="eth-usdt">ETH/USDT</option>
      <option value="bnb-usdt">BNB/USDT</option>
      <option value="eth-btc">ETH/BTC</option>
    </select>
    <select
      required
      name="transaction-flag"
      @change="resetAsset"
      v-model="transactionFlag"
    >
      <option value="Buy">Buy</option>
      <option value="Sell">Sell</option>
    </select>
    <br />
    <br />
    <p>
      {{ transactionFlag }}: {{ transaction.quoteAsset }}
      {{
        transactionFlag == "Buy"
          ? transaction.currency.split("-")[1]
          : transaction.currency.split("-")[0]
      }}
    </p>
    <input
      type="number"
      v-model.number="transaction.quoteAsset"
      @change="
        PreviewCoin(
          this.transactionFlag,
          this.transaction.currency,
          this.transaction.quoteAsset
        )
      "
    />
    <br />
    <br />
    <p>
      Got: {{ transaction.baseAsset }}
      {{
        transactionFlag == "Buy"
          ? transaction.currency.split("-")[0]
          : transaction.currency.split("-")[1]
      }}
    </p>
    <br />
    <button
      class="btn btn-outline-dark"
      @click="
        commitTransaction(
          this.transaction.currency,
          this.transaction.quoteAsset,
          this.transaction.baseAsset,
          this.transactionFlag
        )
      "
    >
      Confirm
    </button>
  </div>
</template>

<style>
#transactor {
  background: #dfc2f2;
  background-image: linear-gradient(to right, #ffffb3, #ffe6e6);
  background-attachment: fixed;
  background-size: cover;

  box-shadow: 0 15px 30px 1px grey;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  overflow: hidden;
  margin: 5% auto 5% auto;
  max-width: 80%;
  padding: 5%;
}
</style>