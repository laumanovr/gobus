<template>
  <div class="sidebar-container">
    <div class="profile-data">
      <div class="profile-name">
        {{role === 'admin' ? 'Admin GoBus' : 'Партнер GoBus'}}
        <div class="profile-email">{{currentUser.email}}</div>
      </div>
    </div>
    <div class="tabs">
      <div
        class="tab"
        v-for="(item, i) in sidebar[role]"
        :key="i"
        :class="{ active: isActive(item) }"
        @click="navToRoute(item)"
      >
        <v-icon :color="isActive(item) ? 'white' : 'blue darken-1'">{{ item.icon }}</v-icon>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="sign-out" @click="logOut">
      <v-icon color="red" class="icon-logout">mdi-logout</v-icon>
      <span>Выход</span>
    </div>
  </div>
</template>

<script>
import {LoginService} from "@/services/login.service";

export default {
  props: {
    role: String
  },
	data() {
		return {
			sidebar: {
			  admin: [
          {
            name: 'Пассажиры',
            route: '/manage',
            icon: 'mdi-account-group'
          },
          {
            name: 'Водители',
            route: '/manage/driver',
            icon: 'mdi-card-account-details-outline'
          },
          {
            name: 'Рейсы',
            route: '/manage/trip',
            icon: 'mdi-map-clock'
          },
          {
            name: 'Маршруты',
            route: '/manage/itinerary',
            icon: 'mdi-map-marker-path'
          },
          {
            name: 'Остановки',
            route: '/manage/stations',
            icon: 'mdi-bus-stop'
          },
          {
            name: 'Транспорт',
            route: '/manage/transport',
            icon: 'mdi-train-car'
          },
          {
            name: 'Аналитика',
            route: '/manage/analytics',
            icon: 'mdi-poll'
          },
          {
            name: 'Покупки',
            route: '/manage/purchases',
            icon: 'mdi-currency-usd'
          },
          {
            name: 'Партнеры',
            route: '/manage/partners',
            icon: 'mdi-handshake-outline'
          }
        ],
        partner: [
          {
            name: 'Купоны',
            route: '/partner-manage',
            icon: 'mdi-handshake-outline'
          }
        ]
      }
		};
	},
  computed: {
    currentUser() {
      return JSON.parse(window.localStorage.getItem('busAdmin'));
    }
  },
	methods: {
		isActive(item) {
			return this.$route.path === item.route;
		},
		navToRoute(item) {
		  if (!this.isActive(item)) {
				this.$router.push(item.route);
			}
		},
		logOut() {
			LoginService.onLogOut();
		}
	}
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  width: 250px;
  border-right: 1px solid #bfbfbf;
  padding: 20px 10px 0;
  .profile-data {
    border-bottom: 1px solid #E9EAEE;
    margin-bottom: 14px;
    padding-bottom: 5px;
    .profile-name {
      font-weight: 500;
      font-size: 20px;
      padding: 8px 0;
      text-align: center;
    }
    .profile-email {
      font-size: 14px;
    }
  }
  .tabs {
    .tab {
      font-weight: 500;
      font-size: 16px;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      padding: 8px 5px 8px 15px;
      cursor: pointer;
      &.active {
        background: #1E88E5;
        color: #fff;
        border-radius: 4px;
      }
      span {
        margin-left: 25px;
      }
    }
  }
  .sign-out {
    position: fixed;
    bottom: 0;
    width: 225px;
    display: flex;
    justify-content: center;
    border-top: 1px solid #A6ACBB;
    padding: 12px 0;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    background: #fff;
    .icon-logout {
      transform: rotate(180deg);
      margin-right: 5px;
    }
  }
}
</style>

