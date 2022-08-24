<template>
  <div class="passenger-container">
    <h2>Пассажиры</h2>
    <template v-if="passengerList.length">
      <table class="table">
        <thead>
        <tr>
          <th>№</th>
          <th>ФИО</th>
          <th>Дата Регистрации</th>
          <th>Номер</th>
          <th>Почта</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(passenger, i) in passengerList" :key="i">
          <td>{{ ((page - 1) * 10) + (i + 1)  }}</td>
          <td>{{ passenger.surname +' '+ passenger.name }}</td>
          <td>{{ new Date(passenger.createdAt).toLocaleDateString('ru') }}</td>
          <td>{{ passenger.mobileNumber }}</td>
          <td>{{ passenger.email }}</td>
        </tr>
        </tbody>
      </table>
      <div class="vertical-space"></div>
      <v-pagination
        v-model="page"
        :length="totalUsersCount"
        :total-visible="10"
        @input="getPassengerList"
      />
    </template>
  </div>
</template>

<script>
import {PassengerService} from "@/services/passenger.service";

export default {
	data() {
		return {
			passengerList: [],
			totalUsersCount: 0,
			page: 1
		};
	},
	mounted() {
		this.getPassengerList();
	},
	methods: {
		async getPassengerList() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await PassengerService.fetchPassengerList(this.page);
				this.passengerList = resp?.data?.users;
				this.totalUsersCount = Math.ceil(resp.count / 10);
				this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				this.$store.dispatch('LoaderStore/setLoader', false);
			}
		}
	}
};
</script>

<style lang="scss">

</style>
