export class User {
  constructor(username) {
    this.username = username
    this.balance = {
      usdt: {
        amount: 10000,
      },
      btc: {
        amount: 0,
      },
      eth: {
        amount: 0,
      },
    }
    this.transactions = [
      {
        transaction: "buy",
        currency: "btc-usdt",
        // cuurency to paid
        quoteAsset: 0,
        // currency that will get
        baseAsset: 0,
      },
    ]
  }

  addTransaction(transaction, currency, quoteAsset, baseAsset) {
    this.transactions.push({
        transaction: transaction,
        currency: currency,
        // cuurency to paid
        quoteAsset: quoteAsset,
        // currency that will get
        baseAsset: baseAsset,
    })
  }

  updateBalance(currency, amount) {
    this.balance[currency]["amount"] = amount
  }
}
