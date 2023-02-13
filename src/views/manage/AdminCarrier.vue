<template>
  <div class="admin-carrier">
    <h2>Перевозчики</h2>
    <div class="align-right">
      <v-btn color="primary" @click="toggleCarrierModal('create')">Добавить +</v-btn>
    </div>
    <div class="vertical-space"></div>
    <table class="table">
      <thead>
      <tr>
        <th>#</th>
        <th>Имя</th>
        <th>Email</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(carrier, i) in carriers" :key="i">
        <td>{{i+1}}</td>
        <td>{{carrier.carrierName}}</td>
        <td>{{carrier.email}}</td>
        <td><v-icon color="primary" class="action-icon" @click="toggleCarrierModal('update', carrier)">mdi-lead-pencil</v-icon></td>
      </tr>
      </tbody>
    </table>

    <modal name="carrier-modal" height="auto">
      <div class="align-center">
        <h3>{{mode === 'create' ? 'Добавить перевозчика' : 'Редактировать'}}</h3>
      </div>
      <v-form ref="carrierForm">
        <v-text-field label="Имя перевозчика" v-model="carrier.carrierName" :rules="requiredRule" />
        <v-text-field label="Email" v-model="carrier.email" :rules="requiredRule" />
        <v-text-field label="Пароль" v-model="carrier.password" :rules="requiredRule" />
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleCarrierModal">Отмена</v-btn>
        <v-btn color="success" @click="submitCarrier">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {CarrierService} from "@/services/carrier.service";

export default {
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			carriers: [],
			mode: 'create',
			carrier: {
				carrierName: '',
				password: '',
				email: ''
			}
		};
	},
	mounted() {
		this.getCarrierList();
	},
	methods: {
		async getCarrierList() {
			try {
				this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await CarrierService.fetchCarrierList();
				this.carriers = resp.data?.carriers;
				this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		toggleCarrierModal(mode, carrier) {
			this.mode = mode;
			if (mode && mode === 'create') {
				this.carrier.carrierName = '';
				this.carrier.email = '';
				this.carrier.password = '';
			}
			if (mode && mode === 'update') {
				this.carrier.id = carrier.id;
				this.carrier.carrierName = carrier.carrierName;
				this.carrier.email = carrier.email;
				this.carrier.password = '';
			}
			this.$modal.toggle('carrier-modal');
		},
		async submitCarrier() {
			if (this.$refs.carrierForm.validate()) {
				try {
					this.$store.dispatch('LoaderStore/setLoader', true);
					await CarrierService[this.mode](this.carrier);
					this.toggleCarrierModal();
					this.getCarrierList();
					this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.success('Успешно!');
				} catch (err) {
					this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error(err);
				}
			}
		}
	}
};
</script>
