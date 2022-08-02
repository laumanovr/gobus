<template>
  <div class="driver-container">
    <h2>Водители</h2>

    <div class="align-right">
      <v-btn color="primary" @click="toggleDriverModal">Добавить +</v-btn>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>ФИО</th>
          <th>Дата Регистрации</th>
          <th>Номер</th>
          <th>Права</th>
          <th>Почта/Логин</th>
          <th>Пароль</th>
          <th>Фото</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td>Иван</td>
        <td>04.05.2022</td>
        <td>0555123465</td>
        <td>Категория B</td>
        <td>ivan@mail.ru</td>
        <td>123</td>
        <td>Фотка</td>
        <td>
          <v-icon color="primary" class="action-icon">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon">mdi-delete</v-icon>
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="driverModal" height="auto">
      <div class="align-center"><h3>Добавить водителя</h3></div>
      <v-form ref="driverForm">
        <v-text-field label="ФИО" />
        <v-text-field label="Номер" type="number" />
        <v-text-field label="Права" />
        <v-text-field label="Почта" />
        <v-text-field label="Фото" />
      </v-form>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleDriverModal">Отмена</v-btn>
        <v-btn color="success">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
// import {DriverService} from "@/services/driver.service";

export default {
	data() {
		return {

		};
	},
	mounted() {
	},
	methods: {
		toggleDriverModal() {
			this.$modal.toggle('driverModal');
		}
	}
};
</script>
