<template>
  <div class="stop-container">
    <h2>Остановки</h2>
    <div class="align-right">
      <v-btn color="primary" @click="toggleStopModal">Добавить +</v-btn>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>Название</th>
        <th>Адрес</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Tommi Mall</td>
        <td>Масадыкова 245</td>
        <td>
          <v-icon color="primary" class="action-icon">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon">mdi-delete</v-icon>
        </td>
      </tr>
      </tbody>
    </table>

    <modal name="stopModal" height="auto">
      <div class="align-center">
        <h3>Добавить остановку</h3>
      </div>
      <v-text-field label="Название" />
      <v-text-field label="Адрес" />
      <div class="align-center">
        <v-btn color="red" class="white--text" @click="toggleStopModal">Отмена</v-btn>
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
		toggleStopModal() {
			this.$modal.toggle('stopModal');
		}
	}
};
</script>
