// import {DBAdapter} from "../adapter/db.adapter"
import {User} from "../model/user"

// Instead of getting it from db or memory
// Will shoot to database API

// Instead of directly receive user object as params
// must be change to just 'id' later since the API is an actual
// database that can use find functionalities
export class UserController {
    constructor(config) {
        // const db = new DBAdapter(config)
        // db.connect()
    }

    getUserData(user) {
        return user.username
    }

    getBalace(user) {
        return user.balance
    }

    getSpecificBalance(user, currency) {
        return user.balance[currency]
    }

    getTransactionsHistory(user){
        return user.transactions
    }

    createNewUser(username) {
        return new User(username)
    }

    updateUserBalance(user, currency, amount) {
        console.log(amount)
        console.log(user.balance)
        user.updateBalance(currency, amount)
    }

    addUserTransaction(user,transaction, currency, quoteAsset, baseAsset) {
        user.addTransaction(transaction, currency, quoteAsset, baseAsset)
    }
}