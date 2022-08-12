<template>
  <v-app id="app">
    <router-view />
    <PreLoader v-if="isLoading" />
    <DeleteModal />
  </v-app>
</template>

<script>
import {mapState} from 'vuex';

export default {
	name: 'App',
	components: {
		PreLoader: () => import('@/components/PreLoader'),
		DeleteModal: () => import('@/components/DeleteModal')
	},
	computed: {
		...mapState('LoaderStore', ['isLoading'])
	},
};
</script>
