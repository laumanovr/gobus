<template>
  <modal name="delete-modal" height="auto">
    <div class="align-center">
      <h3>Вы действительно хотите удалить?</h3>
    </div>
    <div class="vertical-space"></div>
    <div class="align-center">
      <v-btn color="primary" @click="$modal.hide('delete-modal')">Отмена</v-btn>
      <v-btn color="red" class="white--text" @click="deleteItem">Удалить</v-btn>
    </div>
  </modal>
</template>

<script>
import DeleteMixin from "@/mixin/DeleteMixin";
export default {
	mixins: [DeleteMixin]
};
</script>
