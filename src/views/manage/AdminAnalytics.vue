<template>
  <div class="analytics-container">
    <h2>Аналитика</h2>

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
			analyticsData: []
		};
	},
	created() {
		this.getAnalytics();
	},
	methods: {
		async getAnalytics() {
			try {
				this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await AnalyticsService.fetchStationCount();
				this.analyticsData = resp.data?.stats;
				this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		}
	}
};
</script>
