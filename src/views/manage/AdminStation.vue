<template>
  <div class="station-container">
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

    <!--Station Modal-->
    <modal name="stationModal" height="auto">
      <div class="align-center">
        <h3>{{mode === 'create' ? 'Добавить остановку' : 'Редактировать остановку'}}</h3>
      </div>
      <v-form ref="stationForm">
        <v-text-field
          label="Название"
          v-model="station.name"
          :rules="requiredRule"
        />
        <v-text-field
          label="Точка на карте (Координаты)"
          v-model="stationCoordinate"
          :rules="requiredRule"
          readonly
          @click="toggleMapModal"
        />
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleStationModal">Отмена</v-btn>
        <v-btn color="success" @click="submitStation">Подтвердить</v-btn>
      </div>
    </modal>

    <!--Map Modal-->
    <modal name="mapModal" height="90%" width="90%" @opened="onOpenMap">
      <l-map :zoom="zoom" :center="center" @click="setMarker">
        <l-tile-layer :url="url"></l-tile-layer>
        <l-marker :lat-lng="markerLocation"></l-marker>
      </l-map>
      <div class="align-center map-btn">
        <v-btn color="red white--text" @click="toggleMapModal(true)">Отмена</v-btn>
        <v-btn color="success" @click="setStationLatLng" :disabled="!markerLocation.lat">Сохранить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {StationService} from '@/services/station.service';
import DeleteMixin from '@/mixin/DeleteMixin';
import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Icon} from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
	mixins: [DeleteMixin],
	components: {
	  LMap, LMarker, LTileLayer
	},
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			stationList: [],
			mode: '',
			stationCoordinate: '',
			station: {
				name: '',
				lat: 0,
				lng: 0
			},
			zoom: 12,
			center: L.latLng(42.882004, 74.582748),
			url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
			markerLocation: {
			  lat: 0,
				lng: 0
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
		    this.station.lat = '';
		    this.station.lng = '';
		    this.stationCoordinate = '';
				this.markerLocation = L.latLng(0, 0);
			}
		  if (mode && mode === 'update') {
		    this.station.id = station.id;
		    this.station.name = station.name;
		    this.station.lat = station.lat;
		    this.station.lng = station.lng;
		    this.stationCoordinate = `${station.lat}, - ${station.lng}`;
		    this.markerLocation = L.latLng(station.lat, station.lng);
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
		},
		toggleMapModal(isCancel) {
		  if (isCancel) this.markerLocation = L.latLng(this.station.lat, this.station.lng);
		  this.$modal.toggle('mapModal');
		},
		onOpenMap() {
		  this.$nextTick(() => {
				document.querySelector('.leaflet-control-attribution').remove();
			});
		},
		setMarker(e) {
		  this.markerLocation = L.latLng(e.latlng.lat, e.latlng.lng);
		},
		setStationLatLng() {
			this.station.lat = this.markerLocation.lat;
			this.station.lng = this.markerLocation.lng;
			this.stationCoordinate = `${this.station.lat}, - ${this.station.lng}`;
			this.toggleMapModal();
		}
	},
	watch: {
		onDelete() {
			this.getStationList();
		}
	}
};
</script>

<style lang="scss">
.station-container {
  .map-btn {
    position: absolute;
    bottom: 0;
    z-index: 9999999;
    left: 0;
    right: 0;
    background: #fff;
    padding: 6px 0;
    .v-btn {
      height: 30px;
    }
  }
}
</style>
