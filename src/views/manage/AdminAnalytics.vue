<template>
  <div class="analytics-container">
    <h2>Аналитика</h2>

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
            outlined
            background-color="#fff"
            class="short"
            label="Фильтр по дате"
            readonly
            v-bind="attrs"
            v-on="on"
            v-model="filter.formatDate"
            hide-details
            clearable
            @click:clear="onClear"
          />
        </template>
        <v-date-picker
          locale="ru-RU"
          v-model="filter.date"
          @input="onFilterDate"
        />
      </v-menu>
    </div>
    <div class="vertical-space"></div>

    <table class="table">
      <thead>
      <tr>
        <th>Остановка</th>
        <th>Количество посадок</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in analyticsData" :key="i">
        <td>{{ item.station ? item.station.name : '' }}</td>
        <td>{{ item.count }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {AnalyticsService} from "@/services/analytics.service";

export default {
	data() {
		return {
			analyticsData: [],
			queryParam: '',
			filter: {
				date: '',
				formatDate: '',
				filterDatePicker: false
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
		onFilterDate() {
			this.filter.formatDate = new Date(this.filter.date).toLocaleDateString('ru-RU');
			this.filter.filterDatePicker = false;
			this.queryParam = `?date=${this.filter.date}`;
			this.getAnalytics();
		},
		onClear() {
			this.queryParam = '';
			this.getAnalytics();
		}
	}
};
</script>
