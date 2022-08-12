import {mapActions, mapState} from "vuex";

export default {
	computed: {
		...mapState('RemoverStore', ['deleteItemId', 'selectedService', 'onDelete'])
	},
	methods: {
		...mapActions('RemoverStore', ['setItemId', 'setSelectedService', 'setDeleteKey']),

		async deleteItem(selectedService, id, isConfirm) {
			if (isConfirm) {
				this.setSelectedService(selectedService);
				this.setItemId(id);
				this.$modal.show('delete-modal');
			} else {
				try {
					await this.$store.dispatch('LoaderStore/setLoader', true);
					await this.selectedService.delete(this.deleteItemId);
					await this.setDeleteKey(this.onDelete + 1);
					await this.$modal.hide('delete-modal');
					this.$toast.success('Успешно удалено!');
				} catch (err) {
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error(err);
				}
			}
		}
	}
};
