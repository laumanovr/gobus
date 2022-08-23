<template>
  <div class="trip-container">
    <h2>Рейсы</h2>
    <div class="d-flex align-center filter">
      <v-menu
        v-model="filter.filterDatePicker"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            dense
            solo
            class="short"
            label="Дата"
            readonly
            v-bind="attrs"
            v-on="on"
            v-model="filter.formatDate"
            hide-details
            clearable
            @click:clear="filter.date=''"
          />
        </template>
        <v-date-picker
          locale="ru-RU"
          v-model="filter.date"
          @input="onFilterDate"
        />
      </v-menu>
      <v-select
        dense
        solo
        hide-details
        class="short"
        label="Водитель"
        :items="drivers"
        item-text="fullName"
        item-value="id"
        v-model="filter.driverId"
        clearable
      />
      <v-btn color="primary" @click="onFilterTrips">Фильтр</v-btn>
    </div>
    <div class="align-right">
      <v-btn color="primary" @click="toggleTripModal('create')">Добавить +</v-btn>
    </div>
    <template v-if="tripList.length">
      <table class="table">
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
          <td>
            <div v-for="(item, i) in trip.itinerary.items" :key="i">{{ item.station.name }}</div>
          </td>
          <td>{{ trip.dateAndTime }}</td>
          <td>{{ trip.driver.surname + ' ' + trip.driver.name }}</td>
          <td>{{ trip.vehicle.name }}</td>
          <td>{{ trip.price }}</td>
          <td>
          <span @click="getBookings(trip)" class="cursor-pointer">
            {{ trip.vehicle.capacity - trip.availableSeatsCount }}/{{ trip.vehicle.capacity }}
          </span>
          </td>
          <td>
            <v-icon color="primary" class="action-icon" @click="toggleTripModal('update', trip)" title="Редактировать">
              mdi-lead-pencil
            </v-icon>
            <v-icon color="success" class="action-icon" title="Дублировать" @click="toggleTripModal('copy', trip)">
              mdi-refresh
            </v-icon>
            <!--<v-icon color="red" class="action-icon">mdi-delete</v-icon>-->
          </td>
        </tr>
        </tbody>
      </table>
      <div class="vertical-space"></div>
      <div class="text-center" v-if="totalTripCount > 1">
        <v-pagination
          v-model="page"
          :length="totalTripCount"
          :total-visible="10"
          @input="onPaginate"
        />
      </div>
    </template>

    <!--Trip Modal-->
    <modal name="tripModal" height="auto">
      <div class="align-center">
        <h3>{{ mode === 'create' ? 'Добавить Рейс' : 'Редактировать Рейс' }}</h3>
      </div>
      <v-form ref="tripForm">
        <template v-if="mode === 'create'">
          <v-select
            label="Маршрут"
            :items="itineraries"
            item-text="itineraryName"
            item-value="id"
            v-model="trip.itineraryId"
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
          <v-menu
            v-model="showDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="Дата выезда"
                readonly
                v-bind="attrs"
                v-on="on"
                v-model="dateStart"
                :rules="requiredRule"
              />
            </template>
            <v-date-picker
              locale="ru-RU"
              v-model="pickerDate"
              :min="todayDate"
              @input="onChangeDate"
            />
          </v-menu>
        </template>
        <v-text-field v-mask="'##:##'" placeholder="00:00" label="Время выезда" v-model="timeStart" :rules="requiredRule"/>
        <v-select
          label="Водитель"
          :items="drivers"
          item-text="fullName"
          item-value="id"
          v-model="trip.driverId"
          :rules="requiredRule"
        />
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleTripModal">Отмена</v-btn>
        <v-btn color="success" @click="submitTrip">Подтвердить</v-btn>
      </div>
    </modal>

    <!--Booking Modal-->
    <modal name="bookingModal" height="auto" width="700px">
      <div class="align-center">
        <h3>Список пассажиров</h3>
      </div>
      <table class="table no-border">
        <thead>
          <tr>
            <th>№</th>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, i) in bookingList" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ booking.user.surname + ' ' + booking.user.name }}</td>
            <td>{{ booking.user.mobileNumber }}</td>
            <td>{{ booking.status }}</td>
          </tr>
        </tbody>
      </table>
      <div class="vertical-space"></div>
      <div class="align-center">
        <v-btn color="primary" @click="toggleBookingModal">Закрыть</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {TripService} from "@/services/trip.service";
import {ItineraryService} from "@/services/itinerary.service";
import {DriverService} from "@/services/driver.service";
import {TransportService} from "@/services/transport.service";
import {BookingService} from "@/services/booking.service";

export default {
	data() {
		return {
		  page: 1,
			requiredRule: [(v) => !!v || 'Обязательное поле'],
		  itineraries: [],
			drivers: [],
			transports: [],
			mode: '',
			tripList: [],
			totalTripCount: 0,
			timeStart: '',
			showDatePicker: false,
			pickerDate: '',
			dateStart: new Date().toLocaleDateString('ru-RU'),
			todayDate: new Date().toLocaleDateString('en-CA'),
			trip: {
				itineraryId: '',
				driverId: '',
				vehicleId: '',
				price: '',
				startTime: ''
			},
			filter: {
			  date: '',
				formatDate: '',
				driverId: '',
				filterDatePicker: false
			},
			queryParam: '',
			bookingList: []
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
				const resp = await TripService.fetchTripList(this.queryParam);
				this.totalTripCount = Math.ceil(resp.count / 10);
				this.tripList = resp?.data?.trips.map((trip) => {
				  trip.dateAndTime = new Date(trip.startTime).toLocaleString('ru').slice(0, 17);
					return trip;
				});
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
	      this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		onFilterTrips() {
			const date = this.filter.date ? `&date=${this.filter.date}` : '';
			const driver = this.filter.driverId ? `&driverId=${this.filter.driverId}` : '';
			this.queryParam = `${date}${driver}`;
			this.page = 1;
			this.getTripList();
		},
		onPaginate(page) {
			const date = this.filter.date ? `&date=${this.filter.date}` : '';
			const driver = this.filter.driverId ? `&driverId=${this.filter.driverId}` : '';
	    this.queryParam = `&page=${page}` + `${date}${driver}`;
			this.getTripList();
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
				this.timeStart = '';
				this.dateStart = '';
			}
		  if (mode && mode === 'update') {
				this.trip.id = trip.id;
				this.trip.driverId = trip.driver.id;
				this.pickerDate = new Date(trip.startTime).toLocaleDateString('en-CA');
				this.timeStart = new Date(trip.startTime).toLocaleTimeString('ru');
			}
		  if (mode && mode === 'copy') {
				this.trip.itineraryId = trip.itinerary.id;
				this.trip.driverId = trip.driver.id;
				this.trip.vehicleId = trip.vehicle.id;
				this.trip.price = trip.price;
				this.timeStart = new Date(trip.startTime).toLocaleTimeString('ru');
				this.trip.startTime = '';
				this.dateStart = '';
				this.pickerDate = '';
				this.mode = 'create';
			}
			this.$modal.toggle('tripModal');
		},
		onChangeDate() {
			this.dateStart = new Date(this.pickerDate).toLocaleDateString('ru-RU');
			this.showDatePicker = false;
		},
		onFilterDate() {
	    this.filter.formatDate = new Date(this.filter.date).toLocaleDateString('ru-RU');
	    this.filter.filterDatePicker = false;
		},
		async submitTrip() {
			if (this.$refs.tripForm.validate()) {
	      try {
					this.trip.startTime = new Date(`${this.pickerDate}T${this.timeStart}`);
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
		},
		async getBookings(trip) {
	    try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
	      const resp = await BookingService.fetchBookings(trip.id);
				this.bookingList = resp?.data?.bookings;
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.toggleBookingModal();
			} catch (err) {
	      this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		toggleBookingModal() {
	    this.$modal.toggle('bookingModal');
		}
	}
};
</script>

<style lang="scss">
.trip-container {
  .filter {
    max-width: 630px;
  }
}
</style>
