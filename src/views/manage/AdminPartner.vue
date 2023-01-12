<template>
  <div class="admin-partners">
    <h2>Партнеры и купоны</h2>
    <div class="align-right">
      <v-btn color="primary" @click="togglePartnerModal('create')">Добавить партнера</v-btn>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>№</th>
        <th>Имя</th>
        <th>Email</th>
        <th>Купон</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(partner, i) in partners" :key="partner.id">
        <td>{{ i + 1 }}</td>
        <td>{{ partner.partnerName }}</td>
        <td>{{ partner.email }}</td>
        <td><span class="link-dashed" @click="getPartnerCoupons(partner)">Показать купоны</span></td>
        <td>
          <v-icon color="primary" class="action-icon" @click="togglePartnerModal('update', partner)">mdi-lead-pencil</v-icon>
          <v-icon color="red" class="action-icon" title="Удалить партнера" @click="removePartner(partner.id, true)">
            mdi-delete
          </v-icon>
        </td>
      </tr>
      </tbody>
    </table>
    <!--Partner Modal-->
    <modal name="partner-modal" height="auto">
      <div class="align-center">
        <h3>{{partnerMode === 'create' ? 'Добавить партнера' : 'Редактировать партнера'}}</h3>
      </div>
      <v-form ref="partnerForm">
        <v-text-field label="Имя/Название" v-model="partner.partnerName" :rules="requiredRule"/>
        <v-text-field label="Email" v-model="partner.email" :rules="requiredRule"/>
        <v-text-field label="Пароль" v-model="partner.password" :rules="requiredRule" hint="мин: 5 символов"/>
      </v-form>
      <div class="align-center">
        <v-btn color="red white--text" @click="togglePartnerModal">Отмена</v-btn>
        <v-btn color="success" @click="submitPartner">Подтвердить</v-btn>
      </div>
    </modal>
    <!--Coupon Modal-->
    <modal name="coupon-modal" height="auto" width="700" @before-close="selectedPartner={}">
      <div class="align-center">
        <h3 v-if="couponModalMode === 'list'">Купоны: {{ selectedPartner?.partnerName }}</h3>
        <h3 v-else>Добавить купон</h3>
      </div>
      <div class="align-right" v-if="couponModalMode === 'list'">
        <v-btn color="primary" small @click="changeCouponMode('add')">
          Добавить купон
        </v-btn>
      </div>
      <div class="align-left" v-else>
        <v-btn color="primary" small @click="changeCouponMode('list')">
          Назад
        </v-btn>
      </div>
      <div class="vertical-space"></div>
      <template v-if="couponModalMode === 'list'">
        <table class="table no-border">
          <thead>
          <tr>
            <th>№</th>
            <th>Название</th>
            <th>Скидка %</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(coupon, i) in coupons" :key="coupon.id">
            <td>{{ i + 1 }}</td>
            <td>{{ coupon.name }}</td>
            <td>{{ coupon.discount }}</td>
            <td>
              <v-icon color="red" class="action-icon" title="Удалить" @click="removeCoupon(coupon.id, true)">
                mdi-delete
              </v-icon>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="align-center"><v-btn small color="primary" @click="toggleCouponModal">Закрыть</v-btn></div>
      </template>
      <template v-if="couponModalMode === 'add'">
        <v-form ref="couponForm">
          <v-text-field label="Название купона" v-model="coupon.name" :rules="requiredRule"/>
          <v-text-field label="Скидка %" v-model.number="coupon.discount" :rules="requiredRule" type="number"/>
        </v-form>
        <div class="align-center">
          <v-btn color="red white--text" @click="toggleCouponModal">Отмена</v-btn>
          <v-btn color="success" @click="submitCoupon">Подтвердить</v-btn>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import {PartnerService} from "@/services/partner.service";
import {CouponService} from "@/services/coupon.service";
import DeleteMixin from "@/mixin/DeleteMixin";

export default {
	mixins: [DeleteMixin],
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			partners: [],
			coupons: [],
			couponModalMode: 'list',
			partnerMode: '',
			selectedPartner: {},
			partner: {
				email: '',
				password: '',
				partnerName: '',
				isActive: true
			},
			coupon: {
				name: '',
				discount: '',
				partnerId: ''
			}
		};
	},
	mounted() {
		this.getPartnerList();
	},
	methods: {
		async getPartnerList() {
			try {
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await PartnerService.fetchPartnerList();
				this.partners = resp.data?.partners;
				await this.$store.dispatch('LoaderStore/setLoader', false);
			} catch (err) {
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		togglePartnerModal(mode, partner) {
		  this.partnerMode = mode;
		  if (mode && mode === 'create') {
		    this.partner.partnerName = '';
		    this.partner.email = '';
		    this.partner.password = '';
			}
		  if (mode && mode === 'update') {
				this.partner.partnerName = partner?.partnerName;
				this.partner.email = partner?.email;
				this.partner.password = '';
				this.partner.id = partner.id;
			}
			this.$modal.toggle('partner-modal');
		},
		async submitPartner() {
			if (this.$refs.partnerForm.validate()) {
				try {
					await this.$store.dispatch('LoaderStore/setLoader', true);
					await PartnerService[this.partnerMode](this.partner);
					this.$toast.success(`Партнер успешно ${this.partnerMode === 'create' ? 'создан' : 'обновлен'}!`);
					this.togglePartnerModal();
					await this.getPartnerList();
				} catch (err) {
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error(err);
				}
			}
		},
		removePartner(id, isConfirm) {
			const body = {isActive: false};
			this.deleteItem(PartnerService, id, isConfirm, body);
		},
		async getPartnerCoupons(partner, isToggleModal=true) {
			try {
				this.couponModalMode = 'list';
				this.selectedPartner = partner;
				await this.$store.dispatch('LoaderStore/setLoader', true);
				const resp = await CouponService.fetchCouponList(this.selectedPartner.id);
				this.coupons = resp.data?.coupons;
				await this.$store.dispatch('LoaderStore/setLoader', false);
				if (isToggleModal) {
					this.toggleCouponModal();
				}
			} catch (err) {
				await this.$store.dispatch('LoaderStore/setLoader', false);
				this.$toast.error(err);
			}
		},
		toggleCouponModal() {
			this.$modal.toggle('coupon-modal');
		},
		changeCouponMode(type) {
			this.couponModalMode = type;
			this.coupon.name = '';
			this.coupon.discount = '';
		},
		async submitCoupon() {
			if (this.$refs.couponForm.validate()) {
				try {
					await this.$store.dispatch('LoaderStore/setLoader', true);
					this.coupon.partnerId = this.selectedPartner.id;
					const resp = await CouponService.create(this.coupon);
					this.coupons = [resp.data?.coupon, ...this.coupons];
					this.couponModalMode = 'list';
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.success('Купон добавлен!');
				} catch (err) {
					await this.$store.dispatch('LoaderStore/setLoader', false);
					this.$toast.error(err);
				}
			}
		},
		removeCoupon(id, isConfirm) {
			const body = {isActive: false};
			this.deleteItem(CouponService, id, isConfirm, body);
		}
	},
	watch: {
		onDelete() {
			this.getPartnerList();
			if (this.selectedPartner?.id) {
				this.getPartnerCoupons(this.selectedPartner, false);
			}
		}
	}
};
</script>
