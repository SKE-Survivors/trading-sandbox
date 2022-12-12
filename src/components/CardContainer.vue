<script>
import axios from "axios";
import Card from "./Card.vue"

async function getPairs() {
    return await axios.get("http://localhost:3000/pairs")
}

const totalPair = await getPairs()

export default {
    components: {
        Card
    },
    data() {
        return {
            pairs: totalPair["data"]
        }
    }
}
</script>
<template>
    <div class="col scroller">
        <div class="col" v-for="currency in pairs">
            <Card :tradingCurrencies="currency" :symbol="'◑'" />
        </div>
    </div>

</template>
<style scoped>
.scroller {
    overflow-x: scroll;
    display: flex;
}
</style>
