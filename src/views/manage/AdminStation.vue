<template>
  <div class="stop-container">
    <h2>Остановки</h2>
    <div class="align-right">
      <v-btn color="primary" @click="toggleStationModal('create')">Добавить +</v-btn>
    </div>
    <table class="table" v-if="stationList.length">
      <thead>
      <tr>
        <th>Название</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="station in stationList" :key="station.id">
        <td>{{ station.name }}</td>
        <td>
          <v-icon color="primary" class="action-icon" @click="toggleStationModal('update', station)">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon" @click="deleteStation(station.id, true)">mdi-delete</v-icon>
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="stationModal" height="auto">
      <div class="align-center">
        <h3>{{mode === 'create' ? 'Добавить остановку' : 'Редактировать остановку'}}</h3>
      </div>
      <v-form ref="stationForm">
        <v-text-field label="Название" v-model="station.name" :rules="requiredRule" />
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleStationModal">Отмена</v-btn>
        <v-btn color="success" @click="submitStation">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {StationService} from "@/services/station.service";
import DeleteMixin from "@/mixin/DeleteMixin";

export default {
	mixins: [DeleteMixin],
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			stationList: [],
			mode: '',
			station: {
				name: ''
			}
		};
	},
	mounted() {
	  this.getStationList();
	},
	methods: {
		toggleStationModal(mode, station) {
		  this.mode = mode;
		  if (mode && mode === 'create') {
		    this.station.name = '';
			}
		  if (mode && mode === 'update') {
		    this.station.id = station.id;
		    this.station.name = station.name;
			}
			this.$modal.toggle('stationModal');
		},
		async getStationList() {
		  try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await StationService.fetchStationList();
				this.stationList = resp?.data?.stations;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
		    this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		async submitStation() {
		  if (this.$refs.stationForm.validate()) {
		    try {
		      await this.$store.dispatch('LoaderStore/setLoader', true);
					await StationService[this.mode](this.station);
					await this.getStationList();
					await this.$toast.success(this.mode === 'create' ? 'Остановка создана!' : 'Остановка обновлена!');
					await this.toggleStationModal();
					await this.$store.dispatch('LoaderStore/setLoader', false);
				} catch (err) {
		      await this.$toast.error(err);
					await this.$store.dispatch('LoaderStore/setLoader', false);
				}
			}
		},
		deleteStation(id, isConfirm) {
		  this.deleteItem(StationService, id, isConfirm);
		}
	},
	watch: {
		onDelete() {
			this.getStationList();
		}
	}
};
</script>
