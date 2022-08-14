<template>
  <div class="trip-container">
    <h2>Рейсы</h2>
    <div class="align-right">
      <v-btn color="primary" @click="toggleTripModal('create')">Добавить +</v-btn>
    </div>
    <table class="table" v-if="tripList.length">
      <thead>
      <tr>
        <th>№</th>
        <th>Маршрут</th>
        <th>Время выезда</th>
        <th>Водитель</th>
        <th>Машина</th>
        <th>Цена</th>
        <th>Кол-во мест</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(trip, i) in tripList" :key="trip.id">
        <td>{{ i + 1 }}</td>
        <td><div v-for="(item, i) in trip.itinerary.items" :key="i">{{ item.station.name }}</div></td>
        <td>{{ trip.startTime }}</td>
        <td>{{ trip.driver.surname + ' ' + trip.driver.name }}</td>
        <td>{{ trip.vehicle.name }}</td>
        <td>{{ trip.price }}</td>
        <td>{{ trip.availableSeatsCount }}/{{ trip.vehicle.capacity }}</td>
        <td>
<!--          <v-icon color="primary" class="action-icon" @click="toggleTripModal('update', trip)">mdi-lead-pencil</v-icon>-->
<!--          <v-icon color="red" class="action-icon">mdi-delete</v-icon>-->
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="tripModal" height="auto">
      <div class="align-center">
        <h3>{{mode === 'create' ? 'Добавить Рейс' : 'Редактировать Рейс'}}</h3>
      </div>
      <v-form ref="tripForm">
        <v-select
          label="Маршрут"
          :items="itineraries"
          item-text="itineraryName"
          item-value="id"
          v-model="trip.itineraryId"
          :rules="requiredRule"
        />
        <v-select
          label="Водитель"
          :items="drivers"
          item-text="fullName"
          item-value="id"
          v-model="trip.driverId"
          :rules="requiredRule"
        />
        <v-select
          label="Транспорт"
          :items="transports"
          item-text="name"
          item-value="id"
          v-model="trip.vehicleId"
          :rules="requiredRule"
        />
        <v-text-field label="Цена" type="number" v-model="trip.price" :rules="requiredRule"/>
        <v-text-field label="Время выезда" v-model="trip.startTime" :rules="requiredRule"/>
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleTripModal">Отмена</v-btn>
        <v-btn color="success" @click="submitTrip">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {TripService} from "@/services/trip.service";
import {ItineraryService} from "@/services/itinerary.service";
import {DriverService} from "@/services/driver.service";
import {TransportService} from "@/services/transport.service";

export default {
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
		  itineraries: [],
			drivers: [],
			transports: [],
			mode: '',
			tripList: [],
			trip: {
				itineraryId: '',
				driverId: '',
				vehicleId: '',
				price: '',
				startTime: ''
			}
		};
	},
	async mounted() {
	  await this.getTripList();
	  await this.getItineraries();
	  await this.getDrivers();
	  await this.getTransports();
	},
	methods: {
	  async getTripList() {
	    try {
	      await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await TripService.fetchTripList();
				this.tripList = resp?.data?.trips;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
	      this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		async getItineraries() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await ItineraryService.fetchItineraryList();
				this.itineraries = resp?.data?.itineraries.map((itinerary) => {
					const last = itinerary.items.length - 1;
					itinerary.itineraryName = `${itinerary.items[0]?.station?.name} - ${itinerary.items[last]?.station?.name}`;
					return itinerary;
				});
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		async getDrivers() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const res = await DriverService.fetchDriverList();
				this.drivers = res?.data?.drivers.map((driver) => {
					driver.fullName = `${driver.surname} ${driver.name}`;
					return driver;
				});
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		async getTransports() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await TransportService.fetchTransportList();
				this.transports = resp?.data?.vehicles;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		toggleTripModal(mode, trip) {
		  this.mode = mode;
		  if (mode && mode === 'create') {
		    this.trip.itineraryId = '';
		    this.trip.driverId = '';
		    this.trip.vehicleId = '';
		    this.trip.price = '';
		    this.trip.startTime = '';
			}
		  if (mode && mode === 'update') {
				this.trip.id = trip.id;
				this.trip.itineraryId = trip.itineraryId;
				this.trip.driverId = trip.driverId;
				this.trip.vehicleId = trip.vehicleId;
				this.trip.price = trip.price;
				this.trip.startTime = trip.startTime;
			}
			this.$modal.toggle('tripModal');
		},
		async submitTrip() {
	    if (this.$refs.tripForm.validate()) {
	      try {
	        await this.$store.dispatch('LoaderStore/setLoader', true);
					await TripService[this.mode](this.trip);
					await this.getTripList();
	        this.$toast.success(this.mode === 'create' ? 'Рейс создан!' : 'Рейс обновлен!');
					this.toggleTripModal();
				} catch (err) {
	        this.$toast.error(err);
					await this.$store.dispatch('LoaderStore/setLoader', false);
				}
			}
		}
	}
};
</script>
