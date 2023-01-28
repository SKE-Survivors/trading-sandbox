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
        localStorage.token = null;
        localStorage.email = null;
        this.$router.push("/");
        console.log("logout", localStorage.email)
      } catch (error) {
        window.alert("Something went wrong")
      }
    
  },
};
</script>
