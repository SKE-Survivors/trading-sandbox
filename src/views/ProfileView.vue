<script>
import { UserController } from "../server/controller/user.controller";

let userController = new UserController(localStorage.getItem("token"), localStorage.getItem("email"));

export default {
  data() {
    return {
      profile: null,
      coin: null,
      order: null,
    };
  },
  async created() {
    this.profile = await userController.getUserData(localStorage.getItem("email")).catch(() => {
      this.$router.push({ name: "login" });
    });
  },
  methods: {
    getTokenUrl(token) {
      return new URL(`../assets/images/token/${token}.png`, import.meta.url).href;
    },
    toCapitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>

<template>
  <div class="inc my-5 container">
    <div class="col v-center">
      <h1>{{ profile["username"] }}</h1>
      <h3>{{ profile["email"] }}</h3>
    </div>
    <div class="col v-center right">
      <h3>{{ profile["total_percent_change"] }}%</h3>
      <h3>{{ profile["total_balance_usdt"] }} USDT</h3>
    </div>
  </div>

  <div class="section">
    <div
      class="inc card my-2"
      v-for="(balance, token) in profile['wallet']"
      :key="balance"
    >
      <div class="row">
        <div class="col v-center">
          <img :src="getTokenUrl(token)" alt="" class="token-icon" />
        </div>
        <div class="col v-center center">{{ balance }} {{ token.toUpperCase() }}</div>
        <div class="col v-center right">{{ profile["wallet_percent_change"][token] }}%</div>
      </div>
    </div>

    <h3 class="inc my-4">Transaction</h3>

    <div class="inc card my-2" v-for="order in profile['orders']" :key="order">
      <div class="row center">
        <div class="col v-center">#{{ order.id }}</div>
        <div class="col v-center">
          <div class="status-dot"><div class="dot" :class="order.status"></div></div>
          <div class="status-text">{{ toCapitalize(order.status) }}</div>
        </div>
        <div class="col v-center">{{ toCapitalize(order.flag) }}</div>
        <div class="col v-center">{{ order.pair_symbol.toUpperCase() }}</div>
        <div class="col v-center">{{ order.input_amount }}</div>
        <div class="col v-center">{{ order.output_amount }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inc {
  width: 80%;
  margin: auto;
}

.container {
  display: table;
  width: 100%;
}

.container .col {
  display: table-cell;
}

.finished {
  background-color: #545454;
}

.active {
  background-color: #269981;
}

.cancel {
  background-color: #ababab;
}

.dot {
  margin: auto;
  width: calc(28px + 0.25vw) !important;
  height: calc(28px + 0.25vw) !important;
  border-radius: 50%;
}

.status-dot {
  width: 30%;
  float: left;
}
.status-text {
  width: 60%;
  float: right;
}

@media (max-width: 970px) {
  .status-dot {
    width: 100%;
  }
  .status-text {
    display: none;
  }
}
</style>
