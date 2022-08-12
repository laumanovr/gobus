<template>
  <div class="driver-container">
    <h2>Водители</h2>

    <div class="align-right">
      <v-btn color="primary" @click="toggleDriverModal('create')">Добавить +</v-btn>
    </div>

    <table class="table" v-if="driverList.length">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Номер</th>
          <th>E-Mail/Логин</th>
          <th>Права</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="driver in driverList" :key="driver.id">
        <td>{{ driver.name }}</td>
        <td>{{ driver.surname }}</td>
        <td>{{ driver.mobileNumber }}</td>
        <td>{{ driver.email }}</td>
        <td>{{ driver.driverLicense }}</td>
        <td>
          <v-icon color="primary" class="action-icon" @click="toggleDriverModal('update', driver)">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon" @click="deleteDriver(driver.id, true)">mdi-delete</v-icon>
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="driverModal" height="auto" class="driver-modal">
      <div class="align-center">
        <h3>{{mode === 'create' ? 'Добавить водителя' : 'Редактировать водителя'}}</h3>
      </div>
      <v-form ref="driverForm">
        <v-text-field label="Имя" v-model="driver.name" :rules="requiredRule"/>
        <v-text-field label="Фамилия" v-model="driver.surname" :rules="requiredRule"/>
        <v-text-field label="Номер" type="number" v-model="driver.mobileNumber" :rules="requiredRule"/>
        <v-text-field label="E-Mail" v-model="driver.email" :rules="emailRule"/>
        <v-text-field label="Права" v-model="driver.driverLicense" :rules="requiredRule"/>
        <v-text-field label="Пароль" v-model="driver.password" disabled/>
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleDriverModal">Отмена</v-btn>
        <v-btn color="success" @click="submitDriver">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {DriverService} from "@/services/driver.service";
import DeleteMixin from "@/mixin/DeleteMixin";

export default {
	mixins: [DeleteMixin],
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
				mobileNumber: '',
				driverLicense: ''
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
				this.driverList = res?.data?.drivers;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		toggleDriverModal(mode, driver) {
	    this.mode = mode;
	    if (mode && mode === 'create') {
	      this.driver.name = '';
	      this.driver.surname = '';
	      this.driver.email = '';
	      this.driver.mobileNumber = '';
	      this.driver.driverLicense = '';
			}
	    if (mode && mode === 'update') {
	      this.driver.id = driver.id;
				this.driver.name = driver.name;
				this.driver.surname = driver.surname;
				this.driver.email = driver.email;
				this.driver.mobileNumber = driver.mobileNumber;
				this.driver.driverLicense = driver.driverLicense;
				this.driver.password = 'gobus';
			}
			this.$modal.toggle('driverModal');
		},
		async submitDriver() {
			if (this.$refs.driverForm.validate()) {
				try {
					await this.$store.dispatch('LoaderStore/setLoader', true);
					await DriverService[this.mode](this.driver);
					await this.getDriverList();
					await this.$toast.success(this.mode === 'create' ? 'Водитель успешно создан!' : 'Водитель успешно обновлен!');
					await this.toggleDriverModal();
					await this.$store.dispatch('LoaderStore/setLoader', false);
				} catch (err) {
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error(err);
				}
			}
		},
		deleteDriver(driverId, isConfirm) {
			this.deleteItem(DriverService, driverId, isConfirm);
		}
	},
	watch: {
		onDelete() {
			this.getDriverList();
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
