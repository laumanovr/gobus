<template>
  <div class="passenger-container">
    <h2>Пассажиры</h2>
    <table class="table">
      <thead>
      <tr>
        <th>ФИО</th>
        <th>Дата Регистрации</th>
        <th>Номер</th>
        <th>Почта</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Иван Иванов</td>
        <td>05.07.2022</td>
        <td>0505123456</td>
        <td>ivan@mail.com</td>
      </tr>
      <tr>
        <td>Иван Иванов</td>
        <td>05.07.2022</td>
        <td>0505123456</td>
        <td>ivan@mail.com</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
	methods: {
		// testFunc() {
		//   // this.$store.dispatch('LoaderStore/setLoader', true);
		// }
	}
};
</script>

<style lang="scss">

</style>
