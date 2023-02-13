<template>
  <div class="admin-purchase">
    <h2>Покупки</h2>
    <div class="d-flex align-center">
      <v-text-field
        dense
        solo
        hide-details
        class="short"
        label="Email"
        v-model="filter.email"
        @click:clear="onClear('email')"
      />
      <v-select
        dense
        solo
        hide-details
        class="short200px"
        label="Статус"
        :items="tripStatuses"
        item-text="name"
        item-value="val"
        v-model="filter.status"
        clearable
        @click:clear="onClear('status')"
      />
      <v-menu
        v-model="filter.showDatePickerFrom"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            dense
            solo
            class="short200px"
            label="Дата от"
            readonly
            v-bind="attrs"
            v-on="on"
            v-model="filter.formattedDateFrom"
            hide-details
            clearable
            @click:clear="onClear('date')"
          />
        </template>
        <v-date-picker
          locale="ru-RU"
          v-model="filter.pickerDateFrom"
          @input="onFilterDate('showDatePickerFrom', 'pickerDateFrom', 'formattedDateFrom')"
        />
      </v-menu>
      <v-menu
        v-model="filter.showDatePickerTo"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            dense
            solo
            class="short200px"
            label="Дата до"
            readonly
            v-bind="attrs"
            v-on="on"
            v-model="filter.formattedDateTo"
            hide-details
            clearable
            @click:clear="onClear('date')"
          />
        </template>
        <v-date-picker
          locale="ru-RU"
          v-model="filter.pickerDateTo"
          @input="onFilterDate('showDatePickerTo', 'pickerDateTo', 'formattedDateTo')"
        />
      </v-menu>
      <v-btn color="primary" @click="onFilterPurchases">Поиск</v-btn>
    </div>
    <div class="vertical-space"></div>
    <div class="align-left">
      <h3>Всего покупок: {{ totalPurchaseCount }}</h3>
      <h3>Общая сумма: 0</h3>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>№</th>
        <th>ФИО</th>
        <th>E-Mail</th>
        <th>Рейс</th>
        <th>Дата рейса</th>
        <th>Кол-во мест</th>
        <th>Общая сумма</th>
        <th>Статус</th>
        <th>Дата покупки</th>
        <th>Телефон</th>
        <th>Водитель</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(purchase, i) in purchases" :key="i">
        <td>{{ ((page - 1) * 20) + (i + 1) }}</td>
        <td>{{ showFullName(purchase) }}</td>
        <td>{{ purchase?.user?.email }}</td>
        <td @click="getTripBookings(purchase)" class="link-dashed">{{ showTripName(purchase) }}</td>
        <td>{{ showDateTime(purchase?.trip?.startTime) }}</td>
        <td>{{ purchase.seatsCount }}</td>
        <td>{{ purchase.totalPrice }}</td>
        <td>{{ status[purchase.status] }}</td>
        <td>{{ showDateTime(purchase?.createdAt) }}</td>
        <td>{{ purchase?.user?.mobileNumber }}</td>
        <td>{{ purchase?.trip?.driver?.surname + ' ' + purchase?.trip?.driver?.name }}</td>
      </tr>
      </tbody>
    </table>
    <div class="vertical-space"></div>
    <div class="text-center" v-if="totalPages > 1">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        @input="onPaginate"
      />
    </div>

    <!--Booking Modal-->
    <modal name="bookingModal" height="auto" width="700px" class="booking-modal">
      <div class="align-center">
        <h3>Список пассажиров</h3>
      </div>
      <div class="align-center">
        <h5>{{ showTripName(selectedPurchase) }}</h5>
      </div>
      <div class="align-center">
        <h5>{{ showDateTime(selectedPurchase?.trip?.startTime) }}</h5>
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
          <td>{{ showBookingName(booking) }}</td>
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
    </modal>
  </div>
</template>

<script>
import {BookingService} from "@/services/booking.service";

export default {
	data() {
		return {
			status: {
				'PENDING': 'Оплата',
				'CASH': 'Наличка',
				'SCANNED': 'Отсканирован',
				'OTHER': 'Иное'
			},
			tripStatuses: [
				{name: 'Оплата', val: 'PENDING'},
				{name: 'Наличка', val: 'CASH'},
				{name: 'Отсканирован', val: 'SCANNED'},
				{name: 'Иное', val: 'OTHER'}
			],
			purchases: [],
			page: 1,
			totalPurchaseCount: 0,
			totalPages: 0,
			queryParam: '',
			selectedPurchase: {},
			bookingList: [],
			filter: {
				email: '',
				status: '',
				pickerDateFrom: '',
				pickerDateTo: '',
				formattedDateFrom: '',
				formattedDateTo: '',
				showDatePickerFrom: false,
				showDatePickerTo: false
			}
		};
	},
	mounted() {
		this.fetchPurchases();
	},
	methods: {
		async fetchPurchases() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await BookingService.fetchBookings(this.queryParam);
				this.totalPurchaseCount = resp.count;
				this.totalPages = Math.ceil(resp.count / 20);
				this.purchases = resp.data?.bookings;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		showFullName(purchase) {
			if (purchase?.user) {
				return purchase.user.surname + ' ' + purchase.user.name;
			}
			if (purchase?.surname) {
				return purchase.surname + ' ' + purchase.name;
			}
			return 'NO NAME';
		},
		showTripName(purchase) {
			const firstItem = purchase?.trip?.itinerary?.items[0];
			const lastItem = purchase?.trip?.itinerary?.items.at(-1);
			return firstItem?.station.name + ' -> ' + lastItem?.station.name;
		},
		showDateTime(unFormattedDate) {
			const date = new Date(unFormattedDate);
			return date.toLocaleString('ru').slice(0, 17);
		},
		onPaginate() {
			const email = this.filter.email ? `&email=${this.filter.email}` : '';
			const status = this.filter.status ? `&status=${this.filter.status}` : '';
			const dateFrom = this.filter.pickerDateFrom ? `&date[gte]=${this.filter.pickerDateFrom}` : '';
			const dateTo = this.filter.pickerDateTo ? `&date[lt]=${this.filter.pickerDateTo}` : '';
			this.queryParam = `&page=${this.page}${email}${status}${dateFrom}${dateTo}`;
			this.fetchPurchases();
		},
		onFilterPurchases() {
			this.page = 1;
			const email = this.filter.email ? `&email=${this.filter.email}` : '';
			const status = this.filter.status ? `&status=${this.filter.status}` : '';
			const dateFrom = this.filter.pickerDateFrom ? `&date[gte]=${this.filter.pickerDateFrom}` : '';
			const dateTo = this.filter.pickerDateTo ? `&date[lt]=${this.filter.pickerDateTo}` : '';
			this.queryParam = `${email}${status}${dateFrom}${dateTo}`;
			this.fetchPurchases();
		},
		onClear(type) {
			if (type === 'status') {
				this.filter.status = '';
			}
			this.onFilterPurchases();
		},
		async getTripBookings(purchase) {
			try {
				this.selectedPurchase = purchase;
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await BookingService.fetchAllTripBookings(purchase.trip.id);
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
		showBookingName(booking) {
			if (booking?.user) {
				return booking?.user?.name + ' ' + booking?.user?.surname;
			}
			if (booking?.name || booking?.surname) {
				return booking.name + ' ' + booking.surname;
			}
			return 'NO NAME';
		},
		onFilterDate(showDatePicker, pickerDate, formatDate) {
			this.filter[formatDate] = new Date(this.filter[pickerDate]).toLocaleDateString('ru-RU');
			this.filter[showDatePicker] = false;
		},
	}
};
</script>

<style lang="scss">
.booking-modal {
  .vm--modal {
    overflow-y: auto;
    max-height: 90vh;
  }
}
</style>
