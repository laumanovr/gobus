<template>
  <div class="trip-container">
    <h2>Рейсы</h2>
    <div class="align-right">
      <v-btn color="primary" @click="toggleTripModal">Добавить +</v-btn>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>№</th>
        <th>Маршрут</th>
        <th>Время</th>
        <th>Машина</th>
        <th>Водитель</th>
        <th>Пассажиры</th>
        <th>Кол-во</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>1</td>
        <td>Манас-Томми</td>
        <td>10:30 - 11:30</td>
        <td>01KG205ABT</td>
        <td>Талант</td>
        <td>Список</td>
        <td>4/12</td>
        <td>
          <v-icon color="primary" class="action-icon">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon">mdi-delete</v-icon>
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="tripModal" height="auto">
      <div class="align-center">
        <h3>Добавить Рейс</h3>
      </div>
      <v-text-field label="Маршрут"/>
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleTripModal">Отмена</v-btn>
        <v-btn color="success">Подтвердить</v-btn>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
	data() {
		return {

		};
	},
	mounted() {
	},
	methods: {
		toggleTripModal() {
			this.$modal.toggle('tripModal');
		}
	}
};
</script>
