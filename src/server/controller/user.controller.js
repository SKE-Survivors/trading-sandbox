// import {DBAdapter} from "../adapter/db.adapter"
import axios from "axios"

// Instead of getting it from db or memory
// Will shoot to database API

// Instead of directly receive user object as params
// must be change to just 'id' later since the API is an actual
// database that can use find functionalities
export class UserController {
  constructor(config) {
    this.url = "http://localhost:3000/"
  }

  async getUserData(userId) {
    var res = await axios.get(`${this.url + "user/" + userId}`)
    return res["data"]
  }

  async getBalance(userId) {
    var res = await axios.get(`${this.url + "user/" + userId}`)
    return res["data"]["balance"]
  }

  async getSpecificBalance(userId, currency) {
    var res = await axios.get(`${this.url + "user/" + userId}`)
    return res["data"]["balance"][currency]
  }

  async getTransactionsHistory(userId) {
    var res = await axios.get(`${this.url + "transactions?user_id=" + userId}`)
    return res["data"]
  }

  async updateUserBalance(userId, currency, amount) {
    var res = await axios.get(`${this.url + "user/" + userId}`)
    const resBody = res["data"]
    resBody["balance"][currency]["amount"] = amount
    await axios.put(`${this.url + "user/" + userId}`, resBody)
  }

  async addUserTransaction(
    userId,
    transaction,
    currency,
    quoteAsset,
    baseAsset
  ) {
    let body = {
      id: Math.floor(Math.random() * (9999 - 999 + 1)),
      user_id: userId,
      timestamp: Math.floor(Date.now() / 1000),
      type: "market",
      order: "finished",
      status: transaction,
      symbol: currency,
      quote_currency: transaction == "Buy" ? currency.split("-")[1] : currency.split("-")[0],
      quote_asset: quoteAsset,
      base_currency: transaction == "Buy" ? currency.split("-")[0] : currency.split("-")[1],
      base_asset: baseAsset

    }
    await axios.post(`${this.url + "transactions"}`, body)
  }
}
