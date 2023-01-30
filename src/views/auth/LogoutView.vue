<script>
import { UserController } from "../../server/controller/user.controller";

let userController = new UserController();

export default {
  data() {
    return {
      email: localStorage.email,
    };
  },
  async created() {
      try {
        await userController.logout(this.email);
        // localStorage.token = null;
        // localStorage.removeItem("token");
        // localStorage.email = null;
        // localStorage.removeItem("email")
        localStorage.clear()
        this.$router.push("/");
        console.log("logout", localStorage.email)
      } catch (error) {
        this.$router.push("/");
        window.alert("Something went wrong")
      }
    
  },
};
</script>
