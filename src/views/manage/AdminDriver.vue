<template>
  <div class="driver-container">
    <h2>Водители</h2>

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

    <div class="align-right">
      <v-btn color="primary" @click="toggleDriverModal('create')">Добавить +</v-btn>
    </div>

    <table class="table" v-if="driverList.length">
      <thead>
        <tr>
          <th></th>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Номер</th>
          <th>E-Mail/Логин</th>
          <th>Права</th>
          <th>Дата Регистрации</th>
          <th>Отзывы</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(driver, i) in driverList" :key="driver.id">
        <td>{{ i + 1 }}</td>
        <td>{{ driver.name }}</td>
        <td>{{ driver.surname }}</td>
        <td>{{ driver.mobileNumber }}</td>
        <td>{{ driver.email }}</td>
        <td>{{ driver.driverLicense }}</td>
        <td>{{ new Date(driver.createdAt).toLocaleDateString('ru') }}</td>
        <td><span class="link-dashed" @click="openReviewModal(driver)">Показать</span></td>
        <td>
          <v-icon color="primary" class="action-icon" @click="toggleDriverModal('update', driver)">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon" @click="deleteDriver(driver.id, true)">mdi-delete</v-icon>
        </td>
      </tr>
      </tbody>
    </table>
    <h3 class="d-flex justify-center" v-else>Пусто</h3>

    <modal name="driverModal" height="auto" class="driver-modal">
      <div class="align-center">
        <h3>{{mode === 'create' ? 'Добавить водителя' : 'Редактировать водителя'}}</h3>
      </div>
      <v-form ref="driverForm">
        <v-text-field label="Имя" v-model="driver.name" :rules="requiredRule"/>
        <v-text-field label="Фамилия" v-model="driver.surname" :rules="requiredRule"/>
        <v-text-field label="Номер" type="number" v-model="driver.mobileNumber" :rules="requiredRule"/>
        <v-text-field label="E-Mail" v-model="driver.email" :rules="emailRule"/>
        <v-text-field label="Права" v-model="driver.driverLicense" :rules="requiredRule"/>
        <v-text-field label="Пароль" v-model="driver.password" :rules="requiredRule"/>
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleDriverModal">Отмена</v-btn>
        <v-btn color="success" @click="submitDriver">Подтвердить</v-btn>
      </div>
    </modal>

  <!--Review Modal-->
    <modal name="review-modal" height="auto" width="750px" class="review-modal">
      <div class="align-center">
        <h3>Отзывы - {{ driver.surname +' '+ driver.name }}</h3>
      </div>
      <div class="review" v-for="review in reviews" :key="review.id">
        <div class="review__name font-weight-bold d-flex align-center justify-start">
          {{ review.user.surname +' '+ review.user.name }}
          <div class="review__rating d-flex align-center">
            <img src="@/assets/images/unfilled-star.svg" alt="image" v-for="i in 5" :key="i">
            <div class="d-flex align-center filled">
              <img src="@/assets/images/rating-icon.svg" alt="image" v-for="score in review.score" :key="score+'i'">
            </div>
          </div>
        </div>
        <div class="review__text">{{ review.text }}</div>
        <div class="vertical-space"></div>
      </div>
      <div class="vertical-space"></div>
      <div class="align-center">
        <v-btn color="primary" @click="closeReviewModal">Закрыть</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
import {DriverService} from "@/services/driver.service";
import DeleteMixin from "@/mixin/DeleteMixin";

export default {
	mixins: [DeleteMixin],
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			emailRule: [
				(v) => !!v || 'Email обязательный',
				(v) => /^[a-zA-Z0-9()*_\-!#$%^&*,."'@\][]+$/.test(v) || 'Email должен быть на латинице',
				(v) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(v) || 'Email должен быть валидным';
				}
			],
			driverList: [],
			mode: '',
			driver: {
				email: '',
				password: '',
				name: '',
				surname: '',
				mobileNumber: '',
				driverLicense: ''
			},
			filter: {
				date: '',
				formatDate: '',
				surname: '',
				name: '',
				showDatePicker: false
			},
			queryParam: '',
			reviews: []
		};
	},
	mounted() {
		this.getDriverList();
	},
	methods: {
	  async getDriverList() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const res = await DriverService.fetchDriverList(this.queryParam);
				this.driverList = res?.data?.drivers;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		toggleDriverModal(mode, driver) {
	    this.mode = mode;
	    if (mode && mode === 'create') {
	      this.driver.name = '';
	      this.driver.surname = '';
	      this.driver.email = '';
	      this.driver.mobileNumber = '';
	      this.driver.driverLicense = '';
				this.driver.password = '';
			}
	    if (mode && mode === 'update') {
	      this.driver.id = driver.id;
				this.driver.name = driver.name;
				this.driver.surname = driver.surname;
				this.driver.email = driver.email;
				this.driver.mobileNumber = driver.mobileNumber;
				this.driver.driverLicense = driver.driverLicense;
				this.driver.password = '';
			}
			this.$modal.toggle('driverModal');
		},
		async submitDriver() {
			if (this.$refs.driverForm.validate()) {
				try {
					await this.$store.dispatch('LoaderStore/setLoader', true);
					await DriverService[this.mode](this.driver);
					await this.getDriverList();
					await this.$toast.success(this.mode === 'create' ? 'Водитель успешно создан!' : 'Водитель успешно обновлен!');
					await this.toggleDriverModal();
					await this.$store.dispatch('LoaderStore/setLoader', false);
				} catch (err) {
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error(err);
				}
			}
		},
		deleteDriver(driverId, isConfirm) {
			this.deleteItem(DriverService, driverId, isConfirm);
		},
		onFormatDate() {
			this.filter.formatDate = new Date(this.filter.date).toLocaleDateString('ru-RU');
			this.filter.showDatePicker = false;
			this.filter.surname = '';
			this.filter.name = '';
			this.page = 1;
			this.queryParam = `&date=${this.filter.date}`;
			this.getDriverList();
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
			this.getDriverList();
		},
		onSearch() {
			if (this.filter.surname || this.filter.name) {
				const date = this.filter.date ? `&date=${this.filter.date}` : '';
				const surname = this.filter.surname ? `&surname=${this.filter.surname}` : '';
				const name = this.filter.name ? `&name=${this.filter.name}` : '';
				this.queryParam = date + surname + name;
				this.page = 1;
				this.getDriverList();
			}
		},
		async openReviewModal(driver) {
	    this.$store.dispatch('LoaderStore/setLoader', true);
			this.driver.id = driver.id;
			this.driver.name = driver.name;
			this.driver.surname = driver.surname;
			try {
				const resp = await DriverService.fetchDriverReviews(this.driver.id);
				this.reviews = resp.data.reviews;
				this.$modal.show('review-modal');
				this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				this.$toast.error(err);
				this.$store.dispatch('LoaderStore/setLoader', false);
			}
		},
		closeReviewModal() {
			this.$modal.hide('review-modal');
		}
	},
	watch: {
		onDelete() {
			this.getDriverList();
		}
	}
};
</script>

<style lang="scss">
.driver-modal {
  .vm--modal {
    overflow-y: auto;
    max-height: 80vh;
  }
}
.review-modal {
  .review {
    font-size: 15px;
    &__rating {
      position: relative;
      margin-left: 4px;
      .filled {
        position: absolute;
        top: 0;
        left: 0;
      }
      img {
        margin-left: 3px;
        width: 16px;
        height: 16px;
      }
    }
  }
  .vm--modal {
    overflow-y: auto;
    max-height: 90vh;
  }
}
</style>
