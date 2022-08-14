<template>
  <div class="itinerary-container">
    <h2>Маршруты</h2>
    <div class="align-right">
      <v-btn color="primary" @click="toggleItineraryModal('create')">Добавить +</v-btn>
    </div>
    <table class="table" v-if="itineraryList.length">
      <thead>
      <tr>
        <th>Остановки</th>
        <th>Минуты в пути</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in itineraryList" :key="item.id">
        <td><div v-for="(station, i) in item.items" :key="i">{{i+1+'. '}}{{ station.station.name }}</div></td>
        <td><div v-for="(station, i) in item.items" :key="i">{{ station.duration }}</div></td>
        <td>
          <v-icon color="primary" class="action-icon" @click="toggleItineraryModal('update', item)">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon" @click="deleteItinerary(item.id, true)">mdi-delete</v-icon>
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="itineraryModal" height="auto">
      <div class="align-center">
        <h3>Добавить маршрут</h3>
      </div>
      <div class="vertical-space"></div>
      <div class="d-flex flex-wrap">
        <label :for="station.id" class="station d-flex align-center" v-for="station in allStations" :key="station.id">
          <input :id="station.id" type="checkbox" v-model="station.checked" @change="selectStation($event, station)">
          <span>{{ station.name }}</span>
        </label>
      </div>
      <hr>
      <div class="d-flex" v-for="item in itinerary.items" :key="item.stationId">
        <v-text-field
          label="Остановка"
          outlined
          readonly
          dense
          class="station__name"
          v-model="item.name"
        />
        <v-text-field
          label="Продолжительность(минуты)"
          outlined
          type="number"
          dense
          class="station__minutes"
          v-model="item.duration"
        />
      </div>
      <div class="align-center">
        <v-btn color="red white--text" @click="toggleItineraryModal">Отмена</v-btn>
        <v-btn color="success" :disabled="!itinerary.items.length" @click="submitItinerary">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {ItineraryService} from "@/services/itinerary.service";
import {StationService} from "@/services/station.service";
import DeleteMixin from "@/mixin/DeleteMixin";

export default {
	mixins: [DeleteMixin],
	data() {
		return {
		  mode: '',
			allStations: [],
			itineraryList: [],
			itinerary: {
				items: []
			}
		};
	},
	mounted() {
		Promise.all([this.getStationList(), this.getItineraryList()]);
	},
	methods: {
		async getItineraryList() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await ItineraryService.fetchItineraryList();
				this.itineraryList = resp?.data?.itineraries;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		async getStationList() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await StationService.fetchStationList();
				this.allStations = resp?.data?.stations.map((obj) => ({...obj, stationId: obj.id, duration: 0}));
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		toggleItineraryModal(mode, itinerary) {
		  this.mode = mode;
		  if (mode && mode === 'create') {
				this.itinerary.items = [];
				this.allStations = this.allStations.map((obj) => ({...obj, checked: false}));
			}
		  if (mode && mode === 'update') {
				this.itinerary.id = itinerary.id;
				this.itinerary.items = itinerary.items.map((obj) => {
					obj.name = obj.station.name;
					obj.stationId = obj.station.id;
					obj.id = obj.stationId;
					return obj;
				});
				const stationIds = itinerary.items.map((obj) => obj.station.id);
				this.allStations = this.allStations.map((station) => {
					if (stationIds.includes(station.id)) station.checked = true;
					return station;
				});
			}
			this.$modal.toggle('itineraryModal');
		},
		selectStation(e, station) {
		  if (e.target.checked) {
				this.itinerary.items.push(station);
				return;
			}
			const index = this.itinerary.items.findIndex((obj) => obj.id === station.id);
			this.itinerary.items.splice(index, 1);
		},
		async submitItinerary() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				await ItineraryService[this.mode](this.itinerary);
				await this.getItineraryList();
				this.$toast.success(this.mode === 'create' ? 'Маршрут создан!' : 'Маршрут обновлен!');
				this.toggleItineraryModal();
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		deleteItinerary(id, isConfirm) {
		  this.deleteItem(ItineraryService, id, isConfirm);
		}
	},
	watch: {
		onDelete() {
			this.getItineraryList();
		}
	}
};
</script>

<style lang="scss">
.itinerary-container {
  .station {
    cursor: pointer;
    border: 1px solid;
    border-radius: 5px;
    padding: 0 5px;
    margin: 5px;
    span {
      font-size: 14px;
      margin-left: 5px;
    }
    &__name {
      margin-right: 15px;
    }
    &__minutes {
      width: 20%;
    }
  }
  .vm--modal {
    overflow-y: auto;
    max-height: 90vh;
  }
}
</style>
