// import {DBAdapter} from "../adapter/db.adapter"
import axios from "axios"
import { User } from "../model/user"

// Instead of getting it from db or memory
// Will shoot to database API

// Instead of directly receive user object as params
// must be change to just 'id' later since the API is an actual
// database that can use find functionalities
export class UserController {
  constructor(config) {
    this.url = "http://localhost:3000/user/"
  }

  async getUserData(userId) {
    var res = await axios.get(`${this.url + userId}`)
    return res["data"]
  }

  async getBalance(userId) {
    var res = await axios.get(`${this.url + userId}`)
    return res["data"]["balance"]
  }

  async getSpecificBalance(userId, currency) {
    var res = await axios.get(`${this.url + userId}`)
    return res["data"]["balance"][currency]
  }

  async getTransactionsHistory(userId) {
    var res = await axios.get(`${this.url + userId}`)
    return res["data"]["transaction"]
  }

  async updateUserBalance(userId, currency, amount) {
    var res = await axios.get(`${this.url + userId}`)
    const resBody = res["data"]
    resBody["balance"][currency]["amount"] = amount
    await axios.put(`${this.url + userId}`, resBody)
  }

  async addUserTransaction(
    userId,
    transaction,
    currency,
    quoteAsset,
    baseAsset
  ) {
    var res = await axios.get(`${this.url + userId}`)
    const resBody = res["data"]
    resBody["transactions"].push({
      transaction: transaction,
      currency: currency,
      quoteAsset: quoteAsset,
      baseAsset: baseAsset,
    })
    await axios.put(`${this.url + userId}`, resBody)
  }
}
