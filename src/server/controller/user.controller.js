// import {DBAdapter} from "../adapter/db.adapter"
import axios from "axios"

// Instead of getting it from db or memory
// Will shoot to database API

// Instead of directly receive user object as params
// must be change to just 'id' later since the API is an actual
// database that can use find functionalities
export class UserController {
  constructor(token = null, email = null) {
    this.url = import.meta.env.VITE_HOST
    this.token = token
    this.email = email
  }

  async signup(email, username, pwd, cpwd) {
    let body = {
      email: email,
      username: username,
      password: pwd,
      "confirm-password": cpwd,
    }
    await axios.post(`${this.url + "/api/auth/signup"}`, body)
    const res = await this.login(email, pwd)
    return res
  }

  async login(email, pwd) {
    let body = {
      email: email,
      password: pwd,
    }

    const res = await axios.post(`${this.url + "/api/auth/login"}`, body)
    const resBody = res["data"]
    this.token = resBody["MESSAGE"]["token"]
    this.email = email
    return resBody["MESSAGE"]["token"]
  }

  async login_third_party(third_party) {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*" 
      }
    }
    const res = await axios.get(`${this.url + "/api/auth/login/" + third_party}`, config)
    const resBody = res["data"]
    this.token = resBody["MESSAGE"]["token"]
    this.email = email
    return resBody["MESSAGE"]["token"]
  }

  async logout(email) {
    const res = await axios.get(
      `${this.url + "/api/auth/logout?email=" + email}`
    )
    const resBody = res["data"]
    return resBody["MESSAGE"]
  }

  async getUserData(email) {
    if (!email) {
      return null
    }
    var res = await axios
      .get(`${this.url + "/api/auth/user?email=" + email}`)
      .catch(() => {
        return
      })
    return res["data"]["data"]
  }

  async getTransactionsHistory(email) {
    var res = await this.getUserData(email)
    return res["orders"]
  }

  async addUserTransaction(
    email,
    token,
    status,
    transaction,
    currency,
    quoteAsset,
    baseAsset
  ) {
    let body = {
      user_email: email,
      status: status,
      flag: transaction,
      pair_symbol: currency,
      input_amount: quoteAsset,
      output_amount: baseAsset,
    }
    const res = await axios.post(
      `${
        this.url +
        "/api/trading/order?email=" +
        email +
        "&token=" +
        token
      }`,
      body
    )

    const resBody = res["data"]
    return resBody["MESSAGE"]
  }

  async sendTrigger(email, token, transaction, currency, quoteAsset, baseAsset, stop_price) {
    let body = {
      flag: transaction,
      pair_symbol: currency,
      input_amount: quoteAsset,
      output_amount: baseAsset,
      stop_price: stop_price,
    }
    const res = await axios.post(
      `${
        this.url +
        "/api/trading/trigger?email=" +
        email +
        "&token=" +
        token
      }`,
      body
    )

    const resBody = res["data"]
    return resBody["MESSAGE"]
  }
}
