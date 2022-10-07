<template>
  <div class="trip-container">
    <h2>Рейсы</h2>
    <div class="d-flex align-center">
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
            @click:clear="onClear('date')"
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
        @click:clear="onClear"
      />
      <v-select
        dense
        solo
        hide-details
        class="short"
        label="Статус"
        :items="tripStatuses"
        item-text="name"
        item-value="val"
        v-model="filter.status"
        clearable
        @click:clear="onClear"
      />
      <v-btn color="primary" @click="onFilterTrips">Фильтр</v-btn>
    </div>

    <div class="vertical-space"></div>

    <div class="align-right">
      <v-btn color="primary" @click="toggleTripModal('create')">Добавить +</v-btn>
    </div>

    <v-tabs background-color="transparent" class="d-flex justify-center" v-model="tripTab">
      <v-tab @click="onShowActiveOrPast('active')">Активные</v-tab>
      <v-tab @click="onShowActiveOrPast('past')">Прошедшие</v-tab>
    </v-tabs>

    <template v-if="tripList.length">
      <div class="vertical-space"></div>
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
          <th>Статус</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(trip, i) in tripList" :key="trip.id">
          <td>{{ ((page - 1) * 10) + (i + 1) }}</td>
          <td>
            <div v-for="(item, i) in trip.itinerary.items" :key="i">{{ item.station.name }}</div>
          </td>
          <td>{{ trip.dateAndTime }}</td>
          <td>{{ trip.driver.surname + ' ' + trip.driver.name }}</td>
          <td>{{ trip.vehicle.name }}</td>
          <td>{{ trip.price }}</td>
          <td>
          <span @click="getBookings(trip)" class="link-dashed">
            {{ trip.vehicle.capacity - trip.availableSeatsCount }}/{{ trip.vehicle.capacity }}
          </span>
          </td>
          <td>{{ tripStatus[trip.status] }}</td>
          <td>
            <v-icon v-show="!tripTab" color="primary" class="action-icon" @click="toggleTripModal('update', trip)" title="Редактировать">
              mdi-lead-pencil
            </v-icon>
            <v-icon color="success" class="action-icon" title="Дублировать" @click="toggleTripModal('copy', trip)">
              mdi-refresh
            </v-icon>
            <v-icon color="red" class="action-icon" title="Удалить" @click="removeTrip(trip.id, true)">mdi-delete</v-icon>
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
          <v-text-field label="Цена" type="number" v-model="trip.price" :rules="requiredRule"/>
        </template>
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
        <v-menu
          v-model="showDatePicker"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-combobox
              v-if="mode === 'create'"
              locale="ru-RU"
              v-model="trip.startTimes"
              multiple
              chips
              small-chips
              label="Дата выезда"
              readonly
              v-bind="attrs"
              v-on="on"
              :rules="requiredArrayRule"
            />
            <v-text-field
              v-else
              label="Дата выезда"
              readonly
              v-bind="attrs"
              v-on="on"
              v-model="dateStart"
              :rules="requiredRule"
            />
          </template>
          <v-date-picker
            v-if="mode === 'create'"
            locale="ru-RU"
            v-model="trip.startTimes"
            :min="todayDate"
            multiple
          >
            <v-btn color="primary" text @click="showDatePicker=false">Сохранить</v-btn>
          </v-date-picker>
          <v-date-picker
            v-else
            locale="ru-RU"
            v-model="pickerDate"
            :min="todayDate"
            @input="onChangeDate"
          />
        </v-menu>
        <v-text-field v-mask="'##:##'" placeholder="00:00" label="Время выезда" v-model="timeStart" :rules="requiredRule"/>
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleTripModal">Отмена</v-btn>
        <v-btn color="success" @click="submitTrip">Подтвердить</v-btn>
      </div>
    </modal>

    <!--Booking Modal-->
    <modal name="bookingModal" height="auto" width="700px" class="booking-modal">
      <div class="align-center">
        <h3>{{ bookingMode === 'list' ? 'Список пассажиров' : 'Добавить пассажира' }}</h3>
      </div>
      <div class="align-center" v-if="bookingMode === 'list'">
        <h5>{{ showBookingTrip(trip) }}</h5>
      </div>
      <template v-if="bookingMode === 'list'">
        <div class="align-right">
          <v-btn color="primary" small @click="openBookingMode">Добавить пассажира</v-btn>
        </div>
        <table class="table no-border">
          <thead>
          <tr>
            <th>№</th>
            <th>ФИО</th>
            <th>Посадка</th>
            <th>Высадка</th>
            <th>Статус</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(booking, i) in bookingList" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ booking.user ? (booking.user.name+' '+booking.user.surname) : 'NO NAME' }}</td>
            <td>{{ booking.stationFrom ? booking.stationFrom.name : '' }}</td>
            <td>{{ booking.stationTo ? booking.stationTo.name : '' }}</td>
            <td>{{ status[booking.status] }}</td>
          </tr>
          </tbody>
        </table>
        <div class="vertical-space"></div>
        <div class="align-center">
          <v-btn color="red white--text" @click="toggleBookingModal">Закрыть</v-btn>
        </div>
      </template>
      <template v-if="bookingMode === 'addBooking'">
        <div class="vertical-space"></div>
        <v-form ref="bookingForm">
          <v-text-field label="Имя" v-model="booking.name" :rules="requiredRule" />
          <v-text-field label="Фамилия" v-model="booking.surname" :rules="requiredRule" />
          <v-text-field label="Кол-во мест" v-model="booking.seatsCount" :rules="countQuantityRule" type="number" />
          <v-select label="Остановка посадки" :items="stations" item-text="name" item-value="id" v-model="booking.stationFromId" />
          <v-select label="Остановка высадки" :items="stations" item-text="name" item-value="id" v-model="booking.stationToId" />
        </v-form>
        <div class="align-center">
          <v-btn color="red" class="white--text" @click="toggleBookingModal">Отмена</v-btn>
          <v-btn color="success" @click="createBooking">Добавить</v-btn>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import {TripService} from "@/services/trip.service";
import {ItineraryService} from "@/services/itinerary.service";
import {DriverService} from "@/services/driver.service";
import {TransportService} from "@/services/transport.service";
import {BookingService} from "@/services/booking.service";
import {StationService} from "@/services/station.service";
import DeleteMixin from "@/mixin/DeleteMixin";

export default {
	mixins: [DeleteMixin],
	data() {
		return {
		  requiredArrayRule: [(v) => v.length > 0 || 'Обязательное поле'],
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			countQuantityRule: [
				v => !!v || 'Обязательное поле',
				v => (v && v > 0 && v <= this.trip.availableSeatsCount) || `Min: 1, Max: ${this.trip.availableSeatsCount}`
			],
			page: 1,
		  itineraries: [],
			drivers: [],
			transports: [],
			stations: [],
			mode: '',
			bookingMode: 'list',
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
				startTimes: [],
				startTime: '',
				availableSeatsCount: 0
			},
			filter: {
			  date: '',
				formatDate: '',
				driverId: '',
				status: '',
				filterDatePicker: false
			},
			queryParam: '',
			tripTab: 'active',
			bookingList: [],
			booking: {
				seatsCount: '',
				name: '',
				surname: '',
				stationFromId: 0,
				stationToId: 0
			},
			status: {
			  'PENDING': 'Оплата',
				'CASH': 'Наличка',
				'SCANNED': 'Отсканировано'
			},
			tripStatus: {
			  'PENDING': 'В ожидании',
				'STARTED': 'Уехал',
				'COMPLETED': 'Завершен'
			},
			tripStatuses: [
				{name: 'В ожидании', val: 'PENDING'},
				{name: 'Уехал', val: 'STARTED'},
				{name: 'Завершен', val: 'COMPLETED'}
			]
		};
	},
	async mounted() {
	  this.queryParam = `&date[gte]=${this.todayDate}`;
	  await this.getTripList();
	  await this.getItineraries();
	  await this.getDrivers();
	  await this.getTransports();
	  await this.getStationList();
	},
	methods: {
	  async getStationList() {
	    try {
	      const resp = await StationService.fetchStationList();
	      this.stations = resp.data.stations;
			} catch (err) {
	      this.$toast.error(err);
			}
		},
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
			const status = this.filter.status ? `&status=${this.filter.status}` : '';
			this.queryParam = `${date}${driver}${status}`;
			this.page = 1;
			if (this.queryParam) {
				this.getTripList();
			} else {
			  this.tripTab = 'active';
			  this.onPaginate(1);
			}
		},
		onPaginate(page) {
	    const selectedDate = this.filter.date ? `&date=${this.filter.date}` : '';
			const date = (this.tripTab === 'active' || !this.tripTab) ? `&date[gte]=${this.todayDate}` : `&date[lt]=${this.todayDate}`;
			const driver = this.filter.driverId ? `&driverId=${this.filter.driverId}` : '';
			const status = this.filter.status ? `&status=${this.filter.status}` : '';
	    this.queryParam = `${selectedDate || date}${driver}${status}` + `&page=${page}`;
			this.getTripList();
		},
		onClear(val) {
	    this.$nextTick(() => {
				if (val === 'date') this.filter.date = '';
				this.onFilterTrips();
			});
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
		    this.trip.startTimes = [];
				this.timeStart = '';
			}
		  if (mode && mode === 'update') {
				this.trip.id = trip.id;
				this.trip.driverId = trip.driver.id;
				this.trip.vehicleId = trip.vehicle.id;
				this.dateStart = new Date(trip.startTime).toLocaleDateString('ru');
				this.pickerDate = new Date(trip.startTime).toLocaleDateString('en-CA');
				this.timeStart = new Date(trip.startTime).toLocaleTimeString('ru');
				this.trip.startTimes = [];
			}
		  if (mode && mode === 'copy') {
				this.trip.itineraryId = trip.itinerary.id;
				this.trip.driverId = trip.driver.id;
				this.trip.vehicleId = trip.vehicle.id;
				this.trip.price = trip.price;
				this.trip.startTimes = [];
				this.timeStart = new Date(trip.startTime).toLocaleTimeString('ru');
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
			  if (this.mode === 'create') {
					this.trip.startTimes = this.trip.startTimes.map((date) => {
						date = `${date}T${this.timeStart}`;
						return date;
					});
				} else {
					this.trip.startTime = new Date(`${this.pickerDate}T${this.timeStart}`);
				}
				try {
	        await this.$store.dispatch('LoaderStore/setLoader', true);
					await TripService[this.mode](this.trip);
					await this.onShowActiveOrPast('active');
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
	      this.bookingMode = 'list';
	      this.trip = trip;
				await this.$store.dispatch('LoaderStore/setLoader', true);
	      const resp = await BookingService.fetchAllTripBookings(trip.id);
				this.bookingList = resp?.data?.bookings?.reverse();
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.toggleBookingModal();
			} catch (err) {
	      this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		toggleBookingModal() {
	    this.$modal.toggle('bookingModal');
		},
		openBookingMode() {
	    this.bookingMode = 'addBooking';
			this.booking.seatsCount = '';
			this.booking.surname = '';
			this.booking.name = '';
		},
		async createBooking() {
			if (this.$refs.bookingForm.validate()) {
				try {
					this.$store.dispatch('LoaderStore/setLoader', true);
					const resp = await BookingService.create(this.trip.id, this.booking);
					this.trip = resp.data.booking.trip;
					this.tripList = this.tripList.map((trip) => {
						if (trip.id === this.trip.id) {
							trip.availableSeatsCount = this.trip.availableSeatsCount;
						}
						return trip;
					});
					const bookResp = await BookingService.fetchAllTripBookings(this.trip.id);
					this.bookingList = bookResp?.data?.bookings?.reverse();
					this.$toast.success('Добавлен!');
					this.bookingMode = 'list';
					this.$store.dispatch('LoaderStore/setLoader', false);
				} catch (err) {
					this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error(err);
				}
			}
		},
		onShowActiveOrPast(tab) {
	    this.tripTab = tab;
			this.filter.date = '';
			this.filter.formatDate = '';
			this.filter.driverId = '';
			this.page = 1;
			const activeOrPast = tab === 'active' ? `&date[gte]=${this.todayDate}` : `&date[lt]=${this.todayDate}`;
			this.queryParam = `&page=${this.page}` + activeOrPast;
			this.getTripList();
		},

		showBookingTrip(trip) {
			if (trip.itinerary) {
				const itineraries = trip?.itinerary?.items;
				const lastIndex = itineraries.length - 1;
				const tripName = itineraries[0]?.station?.name + ' - ' + itineraries[lastIndex]?.station?.name;
				return `${tripName}, ${trip.dateAndTime}`;
			}
		},

		removeTrip(tripId, isConfirm) {
			this.deleteItem(TripService, tripId, isConfirm);
		}
	},
	watch: {
		onDelete() {
			this.getTripList();
		}
	}
};
</script>

<style lang="scss">
.trip-container {
  .booking-modal {
    .vm--modal {
      overflow-y: auto;
      max-height: 90vh;
    }
  }
}
</style>
