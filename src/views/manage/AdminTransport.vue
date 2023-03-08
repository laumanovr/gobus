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
        <th>Номер машины</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="transport in transportList" :key="transport.id">
        <td>{{ transport.name }}</td>
        <td>{{ transport.capacity }}</td>
        <td>{{ transport.plateNumber }}</td>
        <td>
          <v-icon color="primary" class="action-icon" @click="toggleTransportModal('update', transport)">mdi-lead-pencil</v-icon>
          <v-icon color="green" class="ml-2 action-icon" @click="toggleSeatsModal(transport)">mdi-car</v-icon>
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
        <v-text-field label="Номер машины" v-model="transport.plateNumber" />
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleTransportModal">Отмена</v-btn>
        <v-btn color="success" @click="submitTransport">Подтвердить</v-btn>
      </div>
    </modal>

    <!--SEATS MODAL-->
    <modal name="seatsModal" class="seats-modal" height="auto">
      <div class="align-center">
        <h3>Цены на сидячие места</h3>
      </div>
      <div class="align-center">
        <h4>{{selectedTransport?.name}}</h4>
      </div>
      <div class="align-right">
        <v-btn color="primary" small @click="addSeatPrice">+Добавить</v-btn>
      </div>
      <div class="vertical-space"></div>
      <v-form ref="seatsForm">
        <div class="d-flex" v-for="(item, i) in seatsPrice.seatsArrangement" :key="i">
          <v-text-field type="number" class="w15p mr-3" :rules="requiredRule" label="От" v-model="item.start" outlined dense />
          <v-text-field type="number" class="w15p mr-3" :rules="requiredRule" label="До" v-model="item.end" outlined dense />
          <v-text-field type="number" class="w15p mr-1" :rules="requiredRule" label="Цена" v-model="item.addPrice" outlined dense />
          <v-icon color="red" class="action-icon" title="Удалить" style="height: 40px" @click="deleteSeat(i)">mdi-delete</v-icon>
        </div>
      </v-form>
      <hr>
      <div class="align-center">
        <v-btn color="red white--text" @click="toggleSeatsModal('')">Отмена</v-btn>
        <v-btn color="success" @click="submitSeatsArrangement">Подтвердить</v-btn>
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
				capacity: 0,
				plateNumber: ''
			},
			selectedTransport: {},
			seatsPrice: {
				seatsArrangement: []
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
				this.transport.plateNumber = '';
			}
			if (mode && mode === 'update') {
				this.transport.id = transport.id;
				this.transport.name = transport.name;
				this.transport.capacity = transport.capacity;
				this.transport.plateNumber = transport.plateNumber;
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
		},
		toggleSeatsModal(transport) {
			if (transport) {
				this.selectedTransport = transport;
				const seats = JSON.parse(JSON.stringify(transport)).seatsArrangement;
				this.seatsPrice.seatsArrangement = seats.length ? seats : [];
			}
		  this.$modal.toggle('seatsModal');
		},
		addSeatPrice() {
		  this.seatsPrice.seatsArrangement.push({
				start: '',
				end: '',
				addPrice: 0
			});
		},
		deleteSeat(index) {
		  this.seatsPrice.seatsArrangement.splice(index, 1);
		},
		async submitSeatsArrangement() {
			if (this.$refs.seatsForm.validate()) {
				try {
					await this.$store.dispatch('LoaderStore/setLoader', true);
					await TransportService.modifySeatPrice(this.selectedTransport.id, this.seatsPrice);
					await this.getTransportList();
					this.toggleSeatsModal();
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.success('Успешно обновлено!');
				} catch (err) {
					this.$toast.error(err);
					await this.$store.dispatch('LoaderStore/setLoader', false);
				}
			}
		}
	}
};
</script>

<style lang="scss">
.seats-modal {
  .vm--modal {
    overflow-y: auto;
    max-height: 90vh;
  }
}
</style>
