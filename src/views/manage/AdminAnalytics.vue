<template>
  <div class="analytics-container">
    <h2>Аналитика</h2>

    <div class="d-flex align-center">
      <v-menu
        v-model="filter.datePickerFrom"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            dense
            outlined
            background-color="#fff"
            class="short"
            label="Дата от"
            readonly
            v-bind="attrs"
            v-on="on"
            v-model="filter.formatDateFrom"
            hide-details
            clearable
            @click:clear="onClear"
          />
        </template>
        <v-date-picker
          locale="ru-RU"
          v-model="filter.dateFrom"
          @input="onFilterDate('from')"
        />
      </v-menu>
      <v-menu
        v-model="filter.datePickerTo"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            dense
            outlined
            background-color="#fff"
            class="short"
            label="Дата до"
            readonly
            v-bind="attrs"
            v-on="on"
            v-model="filter.formatDateTo"
            hide-details
            clearable
            @click:clear="onClear"
          />
        </template>
        <v-date-picker
          locale="ru-RU"
          v-model="filter.dateTo"
          @input="onFilterDate('to')"
        />
      </v-menu>
      <v-btn color="primary" @click="onFilter">Фильтр</v-btn>
    </div>
    <div class="vertical-space"></div>
    <v-data-table
      :headers="headers"
      :items="analyticsData"
      no-data-text="Пусто"
      class="elevation-1"
      hide-default-footer
      disable-pagination
    />
  </div>
</template>

<script>
import {AnalyticsService} from "@/services/analytics.service";

export default {
	data() {
		return {
		  headers: [
				{text: 'Остановка', value: 'station.name', align: 'center'},
				{text: 'Количество посадок', value: 'boarding', align: 'center'},
				{text: 'Количество высадок', value: 'exiting', align: 'center'}
			],
			analyticsData: [],
			queryParam: '',
			filter: {
				dateFrom: '',
				formatDateFrom: '',
				datePickerFrom: false,
				dateTo: '',
				formatDateTo: '',
				datePickerTo: false
			},
		};
	},
	created() {
		this.getAnalytics();
	},
	methods: {
		async getAnalytics() {
			try {
				this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await AnalyticsService.fetchStationBookCount(this.queryParam);
				this.analyticsData = resp.data?.stats;
				this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		onFilterDate(type) {
		  if (type === 'from') {
				this.filter.formatDateFrom = new Date(this.filter.dateFrom).toLocaleDateString('ru-RU');
				this.filter.datePickerFrom = false;
			}
		  if (type === 'to') {
				this.filter.formatDateTo = new Date(this.filter.dateTo).toLocaleDateString('ru-RU');
				this.filter.datePickerTo = false;
			}
			this.queryParam = `?date[gte]=${this.filter.dateFrom}&date[lt]=${this.filter.dateTo}`;
		},
		onClear() {
		  this.filter.formatDateFrom = '';
		  this.filter.formatDateTo = '';
			this.queryParam = '';
			this.getAnalytics();
		},
		onFilter() {
		  if (this.filter.dateFrom && this.filter.dateTo) {
		    this.getAnalytics();
			}
		}
	}
};
</script>
