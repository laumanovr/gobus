<template>
  <div class="passenger-container">
    <h2>Пассажиры</h2>
    <div class="d-flex align-center">
      <v-menu
        v-model="filter.showDatePicker"
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
            label="Дата регистрации"
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
          @input="onFormatDate"
        />
      </v-menu>
      <v-text-field
        dense
        outlined
        background-color="#fff"
        hide-details
        class="short"
        label="Фамилия"
        v-model="filter.surname"
        clearable
        @click:clear="onClear('surname')"
      />
      <v-text-field
        dense
        outlined
        background-color="#fff"
        hide-details
        class="short"
        label="Имя"
        v-model="filter.name"
        clearable
        @click:clear="onClear('name')"
      />
      <v-btn color="primary" @click="onSearch">Поиск</v-btn>
    </div>

    <div class="vertical-space"></div>
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
          <td>{{ ((page - 1) * 10) + (i + 1) }}</td>
          <td>{{ passenger.surname + ' ' + passenger.name }}</td>
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
			page: 1,
			filter: {
				date: '',
				formatDate: '',
				surname: '',
				name: '',
				showDatePicker: false
			},
			queryParam: ''
		};
	},
	mounted() {
		this.getPassengerList();
	},
	methods: {
		async getPassengerList() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await PassengerService.fetchPassengerList(this.page, this.queryParam);
				this.passengerList = resp?.data?.users;
				this.totalUsersCount = Math.ceil(resp.count / 10);
				this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		onFormatDate() {
			this.filter.formatDate = new Date(this.filter.date).toLocaleDateString('ru-RU');
			this.filter.showDatePicker = false;
			this.filter.surname = '';
			this.filter.name = '';
			this.page = 1;
			this.queryParam = `&date=${this.filter.date}`;
			this.getPassengerList();
		},
		onClear(type) {
			if (type === 'date') {
				this.filter.date = '';
				this.filter.formatDate = '';
				const surname = this.filter.surname ? `&surname=${this.filter.surname}` : '';
				const name = this.filter.name ? `&name=${this.filter.name}` : '';
				this.queryParam = surname + name;
			}
			if (type === 'surname') {
				const name = this.filter.name ? `&name=${this.filter.name}` : '';
				const date = this.filter.date ? `&date=${this.filter.date}` : '';
				this.queryParam = name + date;
			}
			if (type === 'name') {
				const surname = this.filter.surname ? `&surname=${this.filter.surname}` : '';
				const date = this.filter.date ? `&date=${this.filter.date}` : '';
				this.queryParam = surname + date;
			}
			this.page = 1;
			this.getPassengerList();
		},
		onSearch() {
			if (this.filter.surname || this.filter.name) {
				const date = this.filter.date ? `&date=${this.filter.date}` : '';
				const surname = this.filter.surname ? `&surname=${this.filter.surname}` : '';
				const name = this.filter.name ? `&name=${this.filter.name}` : '';
				this.queryParam = date + surname + name;
				this.page = 1;
				this.getPassengerList();
			}
		}
	}
};
</script>

<style lang="scss">

</style>
