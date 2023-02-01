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
      try {
        const loader = document.querySelector('#loader')
        loader.style.display = 'block'
        let res = await userController.login(this.email, this.password);
        localStorage.setItem('token', res);
        localStorage.setItem('email', this.email);
        let userData = await userController.getUserData(this.email);
        localStorage.setItem('username', userData["username"]);
        loader.style.display = 'none'
        this.$router.push("/");
      } catch (error) {
        let message = ""
        try {
          message = error["response"]["data"]["MESSAGE"]
        } catch (error) {
          message = "Our server is currently down at the moment, please come back later. We apologize for the inconvenience."
        }
        window.alert(message)
      }
    },
    temporalyAlert() {
      window.alert("features coming soon.")
    },
    async LoginThirdParty(third_party) {
      try {
        let res = await userController.login_third_party(third_party)
        localStorage.setItem("token", res)
        localStorage.setItem("email", this.email)
        this.$router.push("/");
      } catch (error) {
        window.alert("Something went wrong")
      }
    }
  },
};
</script>
<template>
  <div id="loader">
    <div id="loader-content">
      <img
        src="https://www.goldwell.com/content/dam/sites/kaousa/www-goldwell-com/content/master/global/goldwell-loader.gif">
    </div>
  </div>
  <div class="container">
    <form class="card my-5">
      <h1>Login</h1>

      <label for="email">Email</label>
      <input type="text" id="email" name="email" v-model="email" class="form-control input-field" />

      <label for="pwd">Password</label>
      <input type="password" id="pwd" name="pwd" v-model="password" class="form-control input-field" />

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

      <button type="button" class="form-control btn" @click="LoginThirdParty('github')"
        style="background-color: #24292f; color:white;">
        <font-awesome-icon :icon="['fab', 'github']" class="field-icon" />
        Login with Github
      </button>
      <button type="button" class="form-control btn" @click="LoginThirdParty('google')"
        style="background-color: #DF4A32; color:white;">
        <font-awesome-icon :icon="['fab', 'google']" class="field-icon" />
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

#loader {
  display: none; 
  position: fixed; 
  z-index: 1; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto;
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 

}

#loader-content {
  margin: 15% auto; 
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
