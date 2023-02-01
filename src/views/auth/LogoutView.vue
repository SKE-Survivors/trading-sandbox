<script>
import { UserController } from "../../server/controller/user.controller";

let userController = new UserController();

export default {
  data() {
    return {
      email: localStorage.getItem("email"),
    };
  },
  async created() {
    try {
      await userController.logout(this.email);
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      this.$router.push("/");
    } catch (error) {
      window.alert("Something went wrong");
    }
  },
};
</script>
