<template>
  <div class="partner-coupons">
    <h2>Мои купоны</h2>

    <table class="table">
      <thead>
      <tr>
        <th>№</th>
        <th>Название</th>
        <th>Скидка %</th>
        <th><div>Кол-во</div><div>продано</div></th>
        <th><div>Заработанная</div>сумма</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(coupon, i) in coupons" :key="coupon.id">
        <td>{{ i + 1 }}</td>
        <td>{{ coupon.name }}</td>
        <td>{{ coupon.discount }}</td>
        <td>
              <span :class="coupon.bookingsCount ? 'link-dashed' : 'no-touch'" @click="getCouponBookings(coupon)">
                {{ coupon.bookingsCount }}
              </span>
        </td>
        <td>{{ coupon.bookingsAmount }}</td>
      </tr>
      </tbody>
    </table>

    <modal name="partner-coupon-modal" width="1200" height="auto">
      <div class="align-center">
        <h3>Покупки по купону: {{selectedCoupon.name}}</h3>
      </div>
      <table class="table no-border">
        <thead>
        <tr>
          <th>№</th>
          <th>ФИО</th>
          <th>Рейс</th>
          <th>Дата рейса</th>
          <th><div>Кол-во</div><div>мест</div></th>
          <th><div>Общая</div><div>сумма</div></th>
          <th>Промо | %</th>
          <th><div>Заработанная</div><div>сумма</div></th>
          <th>Дата активации</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(booking, i) in couponBookings" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ showFullName(booking) }}</td>
          <td>{{ booking.stationFrom.name+' - '+booking.stationTo.name }}</td>
          <td>{{ showDateTime(booking.trip.startTime) }}</td>
          <td>{{ booking.seatsCount }}</td>
          <td>{{ booking.ticketPrice * booking.seatsCount }}</td>
          <td>{{ selectedCoupon.name +' | '+ selectedCoupon.discount }}</td>
          <td>{{ booking.discountAmount }}</td>
          <td>{{ showDateTime(booking.createdAt) }}</td>
        </tr>
        </tbody>
      </table>
    </modal>
  </div>
</template>

<script>
import {CouponService} from "@/services/coupon.service";
export default {
  data() {
    return {
      coupons: [],
      couponBookings: [],
      selectedCoupon: {}
    }
  },
  computed: {
    currentUser() {
      return JSON.parse(window.localStorage.getItem('busAdmin'));
    }
  },
  mounted() {
    this.getMyCoupons();
  },
  methods: {
    async getMyCoupons() {
      try {
        await this.$store.dispatch('LoaderStore/setLoader', true);
        const resp = await CouponService.fetchCouponList(this.currentUser.id);
        this.coupons = resp.data?.coupons;
        await this.$store.dispatch('LoaderStore/setLoader', false);
      } catch (err) {
        await this.$store.dispatch('LoaderStore/setLoader', false);
        this.$toast.error(err);
      }
    },
    async getCouponBookings(coupon) {
      try {
        await this.$store.dispatch('LoaderStore/setLoader', true);
        this.selectedCoupon = coupon;
        const resp = await CouponService.fetchCouponBookings(coupon.id);
        this.couponBookings = resp?.data?.coupon.bookings;
        await this.$store.dispatch('LoaderStore/setLoader', false);
        this.togglePartnerCouponModal();
      } catch (err) {
        await this.$store.dispatch('LoaderStore/setLoader', false);
        this.$toast.error(err);
      }
    },
    togglePartnerCouponModal() {
      this.$modal.toggle('partner-coupon-modal');
    },
    showFullName(booking) {
      if (booking?.user) {
        return booking.user.surname + ' ' + booking.user.name;
      }
      if (booking?.surname) {
        return booking.surname + ' ' + booking.name;
      }
      return 'NO NAME';
    },
    showDateTime(unFormattedDate) {
      const date = new Date(unFormattedDate);
      return date.toLocaleString('ru').slice(0, 17);
    },
  }
}
</script>
