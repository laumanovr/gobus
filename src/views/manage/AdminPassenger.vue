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
      <v-text-field
        dense
        outlined
        background-color="#fff"
        hide-details
        class="short"
        label="Email"
        v-model="filter.email"
        clearable
        @click:clear="onClear('email')"
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
          <th>Дата рождения</th>
          <th>Пол</th>
          <th>Дата Регистрации</th>
          <th>Номер</th>
          <th>Почта</th>
          <th><div>Воучер</div><div>баланс</div></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(passenger, i) in passengerList" :key="i">
          <td>{{ ((page - 1) * 10) + (i + 1) }}</td>
          <td>{{ passenger.surname + ' ' + passenger.name }}</td>
          <td>{{ new Date(passenger.birthday).toLocaleDateString('ru') }}</td>
          <td>{{ gender[passenger.gender] }}</td>
          <td>{{ new Date(passenger.createdAt).toLocaleDateString('ru') }}</td>
          <td>{{ passenger.mobileNumber }}</td>
          <td>{{ passenger.email }}</td>
          <td><span class="link-dashed" @click="toggleVoucherModal(passenger)">{{ passenger.voucherBalance }}</span></td>
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
    <h3 class="d-flex justify-center" v-else>Пусто</h3>

    <modal name="voucher-modal" height="auto">
      <div class="align-center"><h3>Изменить баланс воучера</h3></div>
      <div class="align-center"><h4>{{selectedUser.surname+' '+selectedUser.name}}</h4></div>
      <v-text-field label="Баланс" v-model.number="voucher.amount" type="number"/>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleVoucherModal">Отмена</v-btn>
        <v-btn color="success" @click="submitVoucher">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {PassengerService} from "@/services/passenger.service";

export default {
	data() {
		return {
		  gender: {
		    MALE: 'М',
				FEMALE: 'Ж'
			},
			passengerList: [],
			totalUsersCount: 0,
			page: 1,
			filter: {
				date: '',
				formatDate: '',
				surname: '',
				name: '',
				email: '',
				showDatePicker: false
			},
			queryParam: '',
			selectedUser: {},
			voucher: {amount: ''}
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
				const email = this.filter.email ? `&email=${this.filter.email}` : '';
				this.queryParam = surname + name + email;
			}
			if (type === 'surname') {
				const name = this.filter.name ? `&name=${this.filter.name}` : '';
				const date = this.filter.date ? `&date=${this.filter.date}` : '';
				const email = this.filter.email ? `&email=${this.filter.email}` : '';
				this.queryParam = name + date + email;
			}
			if (type === 'name') {
				const surname = this.filter.surname ? `&surname=${this.filter.surname}` : '';
				const date = this.filter.date ? `&date=${this.filter.date}` : '';
				const email = this.filter.email ? `&email=${this.filter.email}` : '';
				this.queryParam = surname + date + email;
			}
			if (type === 'email') {
				const surname = this.filter.surname ? `&surname=${this.filter.surname}` : '';
				const name = this.filter.name ? `&name=${this.filter.name}` : '';
				const date = this.filter.date ? `&date=${this.filter.date}` : '';
				this.queryParam = surname + name + date;
			}
			this.page = 1;
			this.getPassengerList();
		},
		onSearch() {
			if (this.filter.surname || this.filter.name || this.filter.email) {
				const date = this.filter.date ? `&date=${this.filter.date}` : '';
				const surname = this.filter.surname ? `&surname=${this.filter.surname}` : '';
				const name = this.filter.name ? `&name=${this.filter.name}` : '';
				const email = this.filter.email ? `&email=${this.filter.email}` : '';
				this.queryParam = date + surname + name + email;
				this.page = 1;
				this.getPassengerList();
			}
		},
		toggleVoucherModal(user) {
		  if (user) {
				this.selectedUser = user;
				this.voucher.amount = user.voucherBalance;
			}
		  this.$modal.toggle('voucher-modal');
		},
		async submitVoucher() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				await PassengerService.editVoucherBalance(this.selectedUser.id, this.voucher);
				await this.getPassengerList();
				this.$toast.success('Баланс успешно изменен');
				this.toggleVoucherModal();
			} catch (err) {
				this.$toast.error(err);
				await this.$store.dispatch('LoaderStore/setLoader', false);
			}
		}
	}
};
</script>

<style lang="scss">

</style>
