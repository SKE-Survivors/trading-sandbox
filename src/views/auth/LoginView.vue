<script>
import { UserController } from "../../server/controller/user.controller";

let userController = new UserController();

export default {
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    async sendForm() {
      let res = await userController.login(this.email, this.password);
      localStorage.token = res;
      localStorage.email = this.email;
      this.$router.push("/");
    },
  },
};
</script>
<template>
  <div class="container">
    <form class="card my-5">
      <h1>Login</h1>

      <label for="email">Email</label>
      <input type="text" id="email" name="email" v-model="email" class="form-control input-field"/>

      <label for="pwd">Password</label>
      <input type="password" id="pwd" name="pwd" v-model="password" class="form-control input-field"/>

      <div class="row my-3">
        <div class="col center" style="margin-top: 12px">
          <router-link :to="{ name: 'signup' }">sign up here!</router-link>
        </div>
        <div class="col">
          <button type="button" @click="sendForm()" class="form-control btn">
            Confirm
          </button>
        </div>
      </div>

      <div class="center hint-color my-3">----------- or -----------</div>
      <button type="button" class="form-control btn" style="background-color: #4267B2; color:white;">
        <font-awesome-icon :icon="['fab', 'square-facebook']" class="field-icon"/>
        Login with Facebook
      </button>
      <button type="button" class="form-control btn" style="background-color: #DF4A32; color:white;">
        <font-awesome-icon :icon="['fab', 'google']" class="field-icon"/>
        Login with Google
      </button>
    </form>
  </div>
</template>

<style scoped>
.card {
  margin: auto;
  width: 30%;
  min-width: 400px;
}

.hint-color {
  color: rgba(255, 255, 255, 0.5);
}

.field-icon {
  float: left;
  height: calc(var(--font-size) + 10px);
}
</style>
