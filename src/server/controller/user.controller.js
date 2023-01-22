// import {DBAdapter} from "../adapter/db.adapter"
import axios from "axios"

// Instead of getting it from db or memory
// Will shoot to database API

// Instead of directly receive user object as params
// must be change to just 'id' later since the API is an actual
// database that can use find functionalities
export class UserController {
  constructor(token=null, email=null) {
    this.url = import.meta.env.VITE_HOST
    this.token = token
    this.email = email
  }

  async signup(email, username, pwd, cpwd) {
    let body = {
        "email": email,
        "username": username,
        "password": pwd,
        "confirm-password": cpwd    
    }
    await axios.post(`${this.url + "/api/auth/signup"}`, body)
    const res = await this.login(email, pwd)
    return res
  }

  async login(email, pwd) {
    let body = {
      "email": email,
      "password": pwd
    }
    const res = await axios.post(`${this.url + "/api/auth/login"}`, body)
    const resBody = res["data"]
    this.token = resBody["MESSAGE"]["token"]
    this.email = email
    return resBody["MESSAGE"]["token"]
  }

  async getUserData() {
    var res = await axios.get(`${this.url + "/api/auth/user?email=" + this.email}`)
    return res["data"]["data"]
  }

  async getBalance() {
    var res = await this.getUserData()
    return res["wallet"]
  }

  async getTransactionsHistory() {
    var res = await this.getUserData()
    return res["orders"]
  }

  async updateUserBalance(currency, amount) {
    var res = await this.getUserData()
    res["wallet"][currency] = amount
    await axios.put(`${this.url + "/api/auth/user?email=" + this.email + "&token=" + this.token}`, res)
  }

  async addUserTransaction(
    status,
    transaction,
    currency,
    quoteAsset,
    baseAsset
  ) {
    let body = {
      status: status,
      flag: transaction,
      pair_symbol: currency,
      input_amount: quoteAsset,
      output_amount: baseAsset
    }
    await axios.post(`${this.url + "/api/trading/order?email=" + this.email + "&token=" + this.token}`, body)
    
    // var res = await this.getUserData()
    // res["orders"].push(body)
    // await axios.put(`${this.url + "/api/auth/user?email=" + this.email + "&token=" + this.token}`, res)
  }

  async sendTrigger(
    transaction,
    currency,
    quoteAsset,
    baseAsset,
    stop_price,
  ) {
    let body = {
      flag: transaction,
      pair_symbol: currency,
      input_amount: quoteAsset,
      output_amount: baseAsset,
      stop_price: stop_price
    }
    await axios.post(`${this.url + "/api/trading/trigger?email=" + this.email + "&token=" + this.token}`, body)
  }
}
