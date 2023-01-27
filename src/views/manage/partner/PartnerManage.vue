<template>
  <div class="manage-container">
    <Sidebar role="partner" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/SideBar';

export default {
  components: {
    Sidebar
  }
};
</script>

<style lang="scss">
.manage-container {
  display: flex;
  position: relative;
  .sidebar-container {
    position: fixed;
    top: 0;
    height: 100vh;
  }
  .main-content {
    background: #f6f6f6cf;
    width: calc(100% - 250px);
    margin-left: 250px;
    min-height: 100vh;
    padding: 30px 20px 50px;
  }
}
</style>
