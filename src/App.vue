<template>
  <v-app id="app">
    <router-view />
    <PreLoader v-if="isLoading" />
  </v-app>
</template>

<script>
import {mapState} from 'vuex';
export default {
	name: 'App',
	components: {
		PreLoader: () => import('@/components/PreLoader')
	},
	computed: {
		...mapState('LoaderStore', ['isLoading'])
	},
};
</script>
