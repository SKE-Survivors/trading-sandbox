<script>

export default {
    data() {
        return {
            quoteAsset: 0,
            // baseAsset: 0,
            transactionFlag: "Buy",
            currency: "btc-usd"
        }
    },
    props: [
        'baseAsset'
    ],

}
</script>
<template>
    <div id="transactor">
        <select required name="currency" v-model="currency">
            <option value="btc-usd">BTC/USD</option>
            <option value="eth-usd">ETH/USD</option>
            <option value="bnb-usd">BNB/USD</option>
            <option value="eth-btc">ETH/BTC</option>
        </select>
        <select required name="transaction-flag" v-model="transactionFlag">
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
        </select>
        <br>
        <br>
        <p>{{ transactionFlag }}: {{ quoteAsset }} {{ transactionFlag == "Buy" ?
                currency.split("-")[1] : currency.split("-")[0]
        }}</p>
        <input type="number" v-model.number="quoteAsset"
            @change="$emit('preview-coin', this.transactionFlag, this.currency, this.quoteAsset)" />
        <br>
        <br>
        <p>Got: {{ baseAsset }} {{ transactionFlag == "Buy" ? currency.split("-")[0] :
                currency.split("-")[1]
        }}</p>
        <br>
        <button class="btn btn-outline-dark"
            @click="$emit('commit-transaction', currency, quoteAsset, baseAsset, transactionFlag); this.quoteAsset = 0">Confirm</button>
    </div>

</template>
<style>
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
</style>
