<template>
  <div class="admin-accounting">
    <h2>Учет</h2>

    <div class="d-flex align-center">
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
          />
        </template>
        <v-date-picker
          locale="ru-RU"
          v-model="filter.pickerDateTo"
          @input="onFilterDate('showDatePickerTo', 'pickerDateTo', 'formattedDateTo')"
        />
      </v-menu>
      <v-select
        dense
        solo
        hide-details
        class="short"
        label="Водитель"
        :items="drivers"
        :item-text="(driver) => (driver.surname+' '+driver.name)"
        item-value="id"
        v-model="filter.driverId"
      />
      <v-btn color="primary" @click="onFilterAccounting">Поиск</v-btn>
    </div>
    <template v-if="accountingData?.trips?.length">
      <div class="vertical-space"></div>
      <div class="d-flex justify-center total-sums">
        <div>
          <div class="label">Всего кол-во:</div>
          <b>{{ accountingData.totalBookingsCount }}</b></div>
        <div>
          <div class="label">Всего сумма:</div>
          <b>{{ accountingData.totalBookingsRevenue }}</b></div>
        <div>
          <div class="label">Всего кол-во безнал:</div>
          <b>{{ accountingData.cashlessBookingsCount }}</b></div>
        <div>
          <div class="label">Всего сумма безнал:</div>
          <b>{{ accountingData.cashlessBookingsRevenue }}</b></div>
        <div>
          <div class="label">Всего кол-во нал:</div>
          <b>{{ accountingData.cashBookingsCount }}</b></div>
        <div>
          <div class="label">Всего сумма нал:</div>
          <b>{{ accountingData.cashBookingsRevenue }}</b></div>
        <div>
          <div class="label">Всего кол-во иное:</div>
          <b>{{ accountingData.otherBookingsCount }}</b></div>
        <div>
          <div class="label">Всего сумма иное:</div>
          <b>{{ accountingData.otherBookingsRevenue }}</b></div>
      </div>
      <div class="vertical-space"></div>
      <table class="table">
        <thead>
        <tr>
          <th>#</th>
          <th>Рейс</th>
          <th>Дата рейса</th>
          <th>Водитель</th>
          <th>
            <div>Кол-во</div>
            <div>наличных</div>
          </th>
          <th>
            <div>Сумма</div>
            <div>наличных</div>
          </th>
          <th>
            <div>Кол-во</div>
            <div>безнал</div>
          </th>
          <th>
            <div>Сумма</div>
            <div>безнал</div>
          </th>
          <th>
            <div>Кол-во</div>
            <div>иное</div>
          </th>
          <th>
            <div>Сумма</div>
            <div>иное</div>
          </th>
          <th>
            <div>Всего</div>
            <div>кол-во</div>
          </th>
          <th>
            <div>Всего</div>
            <div>сумма</div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in accountingData?.trips" :key="i">
          <td>{{ ((page - 1) * 20) + (i + 1) }}</td>
          <td>{{ item?.itinerary?.items[0]?.station?.name + ' - ' + item?.itinerary?.items?.at(-1)?.station?.name }}
          </td>
          <td>{{ showDateTime(item.startTime) }}</td>
          <td>{{ item.driver.surname + ' ' + item.driver.name }}</td>
          <td>{{ item.cashBookingsCount }}</td>
          <td>{{ item.cashBookingsRevenue }}</td>
          <td>{{ item.cashlessBookingsCount }}</td>
          <td>{{ item.cashlessBookingsRevenue }}</td>
          <td>{{ item.otherBookingsCount }}</td>
          <td>{{ item.otherBookingsRevenue }}</td>
          <td>{{ item.totalBookingsCount }}</td>
          <td>{{ item.totalBookingsRevenue }}</td>
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
    </template>
  </div>
</template>

<script>
import {AnalyticsService} from "@/services/analytics.service";
import {DriverService} from "@/services/driver.service";

export default {
	data() {
		return {
			accountingData: {trips: []},
			drivers: [],
			queryParam: '',
			page: 1,
			totalPages: 0,
			filter: {
				driverId: '',
				pickerDateFrom: '',
				pickerDateTo: '',
				formattedDateFrom: '',
				formattedDateTo: '',
				showDatePickerFrom: false,
				showDatePickerTo: false
			}
		};
	},
	async mounted() {
		await this.$store.dispatch('LoaderStore/setLoader', true);
		await this.getAccountingData();
		await this.getDriverList();
	},
	methods: {
		async getAccountingData() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				this.accountingData = await AnalyticsService.fetchTripAccounting(this.queryParam);
				this.totalPages = Math.ceil(this.accountingData.count / 20);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		async getDriverList() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const res = await DriverService.fetchDriverList();
				this.drivers = res?.data?.drivers?.sort((a, b) => a.surname.localeCompare(b.surname, 'default', {sensitivity: 'case'}));
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		showDateTime(unFormattedDate) {
			const date = new Date(unFormattedDate);
			return date.toLocaleString('ru').slice(0, 17);
		},
		onFilterDate(showDatePicker, pickerDate, formatDate) {
			this.filter[formatDate] = new Date(this.filter[pickerDate]).toLocaleDateString('ru-RU');
			this.filter[showDatePicker] = false;
		},
		onPaginate() {
			const dateFrom = this.filter.pickerDateFrom ? `&date[gte]=${this.filter.pickerDateFrom}` : '';
			const dateTo = this.filter.pickerDateTo ? `&date[lt]=${this.filter.pickerDateTo}` : '';
			const driverId = this.filter.driverId ? `&driverId=${this.filter.driverId}` : '';
			this.queryParam = `&page=${this.page}${dateFrom}${dateTo}${driverId}`;
			this.getAccountingData();
		},
		onFilterAccounting() {
			this.page = 1;
			const dateFrom = this.filter.pickerDateFrom ? `&date[gte]=${this.filter.pickerDateFrom}` : '';
			const dateTo = this.filter.pickerDateTo ? `&date[lt]=${this.filter.pickerDateTo}` : '';
			const driverId = this.filter.driverId ? `&driverId=${this.filter.driverId}` : '';
			this.queryParam = `${dateFrom}${dateTo}${driverId}`;
			this.getAccountingData();
		}
	}
};
</script>

<style lang="scss">
.admin-accounting {
  .total-sums {
    & > div {
      text-align: center;
      background: #fff;
      border: 1px solid #808080;
      padding: 5px;
      border-radius: 4px;

      &:not(:last-child) {
        margin-right: 5px;
      }
    }

    .label {
      font-size: 14px;
    }
  }
}
</style>
