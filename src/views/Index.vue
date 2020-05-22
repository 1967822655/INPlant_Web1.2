<template>
    <div class="container">
      <site-nav></site-nav>
      <user-index></user-index>
    </div>
</template>

<script>
import SiteNav from '../components/user/SiteNav'
import UserIndex from '../components/user/UserIndex'
export default {
  name: 'Index',
  components: {SiteNav, UserIndex}
}
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
