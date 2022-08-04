<template>
  <div class="login-container">
    <v-form class="login-form" ref="loginForm" @submit.prevent="submitForm">
      <h2>Go Bus Admin</h2>
      <div>
        <v-text-field
          outlined
          label="Логин"
          autocomplete="new-password"
          v-model="loginData.email"
          :rules="requiredRule"
        />
      </div>
      <div>
        <v-text-field
          outlined
          label="Пароль"
          type="password"
          autocomplete="new-password"
          v-model="loginData.password"
          :rules="requiredRule"
        />
      </div>
      <div class="align-center">
        <v-btn color="primary" large class="full-width" type="submit">Войти</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {LoginService} from "@/services/login.service";

export default {
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			loginData: {
				email: '',
				password: ''
			}
		};
	},
	methods: {
		async submitForm() {
			if (this.$refs.loginForm.validate()) {
			  try {
					await this.$store.dispatch('LoaderStore/setLoader', true);
			    await LoginService.onLogin(this.loginData);
					await this.$store.dispatch('LoaderStore/setLoader', false);
				} catch (err) {
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error('Неправильный логин или пароль');
				}
			}
		}
	}
};
</script>

<style lang="scss">
.login-container {
  height: 100%;
  background-image: url("/src/assets/images/login-bg.jpg");
  background-position: center;
  background-size: cover;
  .login-form {
    max-width: 550px;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 50px 25px rgba(0,0,0,0.75);
    -webkit-box-shadow: 0 0 50px 25px rgba(0,0,0,0.75);
    -moz-box-shadow: 0 0 50px 25px rgba(0,0,0,0.75);
    h2 {
      text-align: center;
      margin-bottom: 15px;
    }
  }
}
</style>
