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
      this.transaction.limit = 0
      this.transaction.limit_amount = 0
      this.transaction.totalSpent = 0
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
      type
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
      let status = "finished"
      if (type == "limit") {
        status = "active"
      } else if (type == "stop") {
        status = "draft"
      }
      await this.user.addUserTransaction(
        status,
        flag,
        currency,
        Number(quoteAsset),
        Number(baseAsset)
      );
      this.balance = await this.user.getBalance();
    },
    async commitTransaction(currency, flag, type) {
      const baseQuoteCurrencies = currency.split("/");
      const balance = await this.user.getBalance();

      let quoteCurrency, baseCurrency;
      let quoteAsset, baseAsset, limit
      quoteAsset = this.transaction.quoteAsset
      baseAsset = this.transaction.baseAsset
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

      this.resetAsset();

      if (balance[quoteCurrency] >= quoteAsset) {
        this.updateTransaction(
          flag,
          currency.replace("/", "-"),
          balance,
          quoteAsset,
          baseAsset,
          quoteCurrency,
          baseCurrency,
          type
        );
      } else {
        console.log("Not enough funds!!!");
      }

      console.log(await this.user.getBalance());
    },
  },
};
</script>

<template>
  <div id="transactor">
    <p>{{ symbol.toUpperCase() }}</p>
    <select required name="type" v-model="type" @change="resetAsset">
      <option value="market">Market</option>
      <option value="limit">Limit</option>
      <option value="stop">Stop</option>
    </select>
    <select required name="transaction-flag" @change="resetAsset" v-model="transactionFlag">
      <option value="Buy">Buy</option>
      <option value="Sell">Sell</option>
    </select>
    <br />
    <br />
    <div v-if="type == 'market'">
      <p>
        {{ transactionFlag }}: {{ transaction.quoteAsset }}
        {{
            transactionFlag == "Buy"
              ? symbol.split("/")[1]
              : symbol.split("/")[0]
        }}
      </p>
      <input type="number" v-model.number="transaction.quoteAsset" @change="
        PreviewCoin(
          this.transactionFlag,
          this.symbol,
          this.transaction.quoteAsset
        )
      " />
      <br />
      <br />
      <p>
        Got: {{ transaction.baseAsset }}
        {{
            transactionFlag == "Buy"
              ? symbol.split("/")[0]
              : symbol.split("/")[1]
        }}
      </p>
      <br />
      <button class="btn btn-outline-dark" @click="
        commitTransaction(
          this.symbol.toLowerCase(),
          this.transactionFlag,
          this.type
        )
      ">
        Confirm
      </button>
    </div>
    <div v-if="type != 'market'">
      <p>
        Price: {{ transaction.limit }}
        {{
            symbol.split("/")[1]
        }}
      </p>
      <input type="number" v-model.number="transaction.limit" @change="
        PreviewCoinWithLimit(
          this.transactionFlag,
          this.transaction.limit,
        )
      " />
      <br />
      <br />
      <p>Amount: {{ transaction.limit_amount }}
        {{ symbol.split("/")[0]
        }}
      </p>
      <input type="number" v-model.number="transaction.limit_amount" @change="
        PreviewCoinWithLimit(
          this.transactionFlag,
          limit_amount = this.limit_amount,
        )
      " />
      <br />
      <br />
      <p>
        Total: {{ transaction.totalSpent }}
        {{
            symbol.split("/")[1]
        }}
      </p>
      <button class="btn btn-outline-dark" @click="
    commitTransaction(
      this.symbol.toLowerCase(),
      this.transactionFlag,
      this.type)">
        Confirm
      </button>
    </div>
    <br />
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
