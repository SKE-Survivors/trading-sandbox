<script>
import Card from "./components/Card.vue"
import Transactor from "./components/Transactor.vue"
import { UserController } from './server/controller/user.controller';

let userController = new UserController("config")

const user = await userController.getUserData(9281)
const balance = await userController.getBalance(9281)

export default {
  components: {
    Card,
    Transactor
  },
  data() {
    return {
      userId: user["id"],
      username: user["username"],
      balance: balance,
      user: userController,
      currency: {
        BTCUSD: null,
        ETHUSD: null,
        ETHBTC: null,
        BNBUSD: null
      },
      transactionFlag: "Buy", 
      transaction: {
        currency: "btc-usd",
        // cuurency to paid
        quoteAsset: 0,
        // currency that will get
        baseAsset: 0
      }
    }
  },
  created() {
    function connectToWebSocket(currency) {

      return new WebSocket('wss://stream.binance.com:9443/ws/' + currency + '@miniTicker');
    }

    connectToWebSocket("btcusdt").addEventListener('message', e => {

      let data = JSON.parse(e.data) || {};
      let { s, c } = data;

      this.currency.BTCUSD = Number(c).toFixed(2);
    });

    connectToWebSocket("ethusdt").addEventListener('message', e => {

      let data = JSON.parse(e.data) || {};
      let { s, c } = data;

      this.currency.ETHUSD = Number(c).toFixed(2);
    });

    connectToWebSocket("ethbtc").addEventListener('message', e => {

      let data = JSON.parse(e.data) || {};
      let { s, c } = data;

      this.currency.ETHBTC = Number(c).toFixed(2);
    });
    
    connectToWebSocket("bnbusdt").addEventListener('message', e => {

      let data = JSON.parse(e.data) || {};
      let { s, c } = data;

      this.currency.BNBUSD = Number(c).toFixed(2);
    });


  },
  methods: {
    rateDeterminer(currency) {
      switch (currency) {
        case "btc-usd":
          return this.currency.BTCUSD
        case "eth-usd":
          return this.currency.ETHUSD
      }
    },
    PreviewCoin(flag, currency, quoteAsset) {
      console.log(flag + " " + currency + " for " + quoteAsset)
      const rate = this.rateDeterminer(currency)
      if (flag == "Buy") {
        this.transaction.baseAsset = (quoteAsset / Number(rate)).toFixed(5)
      } else if (flag == "Sell") {
        this.transaction.baseAsset = (quoteAsset * Number(rate)).toFixed(5)
      }
    },
    async commitTransaction(currency, quoteAsset, baseAsset, flag) {
      const baseQuoteCurrencies = currency.split("-")
      const balance = this.balance

      let quoteCurrency, baseCurrency
      if (flag === "Buy") {
        quoteCurrency = baseQuoteCurrencies[1]
        baseCurrency = baseQuoteCurrencies[0]

      } else if (flag === "Sell") {
        quoteCurrency = baseQuoteCurrencies[0]
        baseCurrency = baseQuoteCurrencies[1]
        
      }
      this.transaction.quoteAsset = 0
      this.transaction.baseAsset = 0

      if (balance[quoteCurrency]["amount"] >= quoteAsset) {
        console.log({
          "currency": currency,
          "quote": quoteAsset,
          "base": baseAsset
        })
        await this.user.updateUserBalance(this.userId, quoteCurrency, Number(balance[quoteCurrency]["amount"]) - Number(quoteAsset))
        await this.user.updateUserBalance(this.userId, baseCurrency, Number(balance[baseCurrency]["amount"]) + Number(baseAsset))
        await this.user.addUserTransaction(this.userId, flag, currency, quoteAsset, baseAsset)
        this.balance = await this.user.getBalance(this.userId)
      }
      else {
        console.log("Not enough funds!!!")
      }

      console.log(await this.user.getBalance(this.userId))
    }
  }
}
</script>

<template>
  <div class="row" style="width: 100%; height: 20%; margin: 0%;">
    <div class="col scroller">
      <div class="col" style="">
        <Card :tradingCurrencies="'BTC/USD'" :symbol="'$'" :value="currency.BTCUSD" />
      </div>
      <div class="col" style="">
        <Card :tradingCurrencies="'ETH/USD'" :symbol="'$'" :value="currency.ETHUSD" />
      </div>
      <div class="col" style="">
        <Card :tradingCurrencies="'BNB/USD'" :symbol="'$'" :value="currency.BNBUSD" />
      </div>
      <div class="col" style="">
        <Card :tradingCurrencies="'ETH/BTC'" :symbol="'B'" :value="currency.ETHBTC" />
      </div>
    </div>
  </div>

  <div class="row" style="width: 100%; margin: 0%">
    <div class="col">
      <Transactor :baseAsset="transaction.baseAsset" @preview-coin="PreviewCoin" @commit-transaction="commitTransaction"/>
    </div>
  </div>
  
  <div class="row" style="width: 100%;">
    <div id="card">
      <p>
        {{ username }}
      </p>
      <p>
        {{ balance }}
      </p>
    </div>
  </div>
</template>

<style scoped>
#transactor {
  background: #DFC2F2;
  background-image: linear-gradient(to right, #ffffb3, #ffe6e6);
  background-attachment: fixed;
  background-size: cover;

  box-shadow: 0 15px 30px 1px grey;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 5px;
  overflow: hidden;
  margin: 5% auto 5% auto;
  max-width: 80%;
  padding: 5%;
}

.scroller {
  overflow-x: scroll;
  display: flex;
}
</style>
