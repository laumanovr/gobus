<template>
  <div class="transport-container">
    <h2>Транспорт</h2>
    <div class="align-right">
      <v-btn color="primary" @click="toggleTransportModal('create')">Добавить +</v-btn>
    </div>
    <table class="table" v-if="transportList.length">
      <thead>
      <tr>
        <th>Название</th>
        <th>Кол-во мест</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="transport in transportList" :key="transport.id">
        <td>{{ transport.name }}</td>
        <td>{{ transport.capacity }}</td>
        <td>
          <v-icon color="primary" class="action-icon" @click="toggleTransportModal('update', transport)">mdi-lead-pencil</v-icon>
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="transportModal" height="auto">
      <div class="align-center">
        <h3>{{mode === 'create' ? 'Добавить транспорт' : 'Редактировать транспорт'}}</h3>
      </div>
      <v-form ref="transportForm">
        <v-text-field label="Название" v-model="transport.name" :rules="requiredRule" />
        <v-text-field label="Количество мест" v-model="transport.capacity" :rules="requiredRule" type="number" />
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleTransportModal">Отмена</v-btn>
        <v-btn color="success" @click="submitTransport">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import DeleteMixin from "@/mixin/DeleteMixin";
import {TransportService} from "@/services/transport.service";

export default {
	mixins: [DeleteMixin],
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			mode: '',
			transportList: [],
			transport: {
				name: '',
				capacity: 0
			}
		};
	},
	mounted() {
		this.getTransportList();
	},
	methods: {
		async getTransportList() {
			try {
				this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await TransportService.fetchTransportList();
				this.transportList = resp?.data?.vehicles;
				this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		toggleTransportModal(mode, transport) {
			this.mode = mode;
			if (mode && mode === 'create') {
				this.transport.name = '';
				this.transport.capacity = 0;
			}
			if (mode && mode === 'update') {
				this.transport.id = transport.id;
				this.transport.name = transport.name;
				this.transport.capacity = transport.capacity;
			}
			this.$modal.toggle('transportModal');
		},

		async submitTransport() {
			if (this.$refs.transportForm.validate()) {
				try {
					this.$store.dispatch('LoaderStore/setLoader', true);
					await TransportService[this.mode](this.transport);
					this.getTransportList();
					this.$toast.success(this.mode === 'create' ? 'Транспорт создан!' : 'Транспорт обновлен!');
					this.toggleTransportModal();
					this.$store.dispatch('LoaderStore/setLoader', false);
				} catch (err) {
					this.$toast.error(err);
					this.$store.dispatch('LoaderStore/setLoader', false);
				}
			}
		}
	}
};
</script>
