<template>
  <div class="driver-container">
    <h2>Водители</h2>

    <div class="align-right">
      <v-btn color="primary" @click="toggleDriverModal">Добавить +</v-btn>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Номер</th>
          <th>E-Mail/Логин</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="driver in driverList" :key="driver.id">
        <td>{{ driver.name }}</td>
        <td>{{ driver.surname }}</td>
        <td>{{ driver.mobileNumber }}</td>
        <td>{{ driver.email }}</td>
        <td>
          <v-icon color="primary" class="action-icon">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon">mdi-delete</v-icon>
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="driverModal" height="auto" class="driver-modal">
      <div class="align-center"><h3>Добавить водителя</h3></div>
      <v-form ref="driverForm">
        <v-text-field label="Имя" v-model="driver.name" :rules="requiredRule"/>
        <v-text-field label="Фамилия" v-model="driver.surname" :rules="requiredRule"/>
        <v-text-field label="Номер" type="number" v-model="driver.mobileNumber" :rules="requiredRule"/>
        <v-text-field label="E-Mail" v-model="driver.email" :rules="emailRule"/>
        <v-text-field label="Пароль" v-model="driver.password" disabled/>
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleDriverModal">Отмена</v-btn>
        <v-btn color="success" @click="createDriver">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {DriverService} from "@/services/driver.service";

export default {
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			emailRule: [
				(v) => !!v || 'Email обязательный',
				(v) => /^[a-zA-Z0-9()*_\-!#$%^&*,."'@\][]+$/.test(v) || 'Email должен быть на латинице',
				(v) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(v) || 'Email должен быть валидным';
				}
			],
			driverList: [],
			mode: '',
			driver: {
				email: '',
				password: 'gobus',
				name: '',
				surname: '',
				mobileNumber: ''
			}
		};
	},
	mounted() {
		this.getDriverList();
	},
	methods: {
	  async getDriverList() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const res = await DriverService.fetchDriverList();
				this.driverList = res.data.drivers;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		toggleDriverModal() {
			this.$modal.toggle('driverModal');
		},
		async createDriver() {
			if (this.$refs.driverForm.validate()) {
				try {
					await this.$store.dispatch('LoaderStore/setLoader', true);
					await DriverService.createDriver(this.driver);
					await this.getDriverList();
					this.toggleDriverModal();
					this.$toast.success('Водитель успешно создан!');
					await this.$store.dispatch('LoaderStore/setLoader', false);
				} catch (err) {
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error(err);
				}
			}
		}
	}
};
</script>

<style lang="scss">
.driver-modal {
  .vm--modal {
    overflow-y: auto;
    max-height: 72vh;
  }
}
</style>
