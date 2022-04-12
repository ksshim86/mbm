<template>
  <q-bar id="bar" class="q-electron-drag text-white">
    <div><q-icon name="dashboard" size="24px" class="q-mr-sm" color="orange"/>Multi Browser Monitoring</div>
    <q-space />
    <q-btn dense flat icon="minimize" @click="minimize" />
    <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
    <q-btn dense flat icon="close" @click="closeApp" />
  </q-bar>
</template>
<script>
export default {
  name: 'MainBar',
  setup () {
    // we rely upon
    function minimize () {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.minimize()
      }
    }

    function toggleMaximize () {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.toggleMaximize()
      }
    }

    function closeApp () {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.close()
      }
    }

    return { minimize, toggleMaximize, closeApp }
  }
}
</script>
<style lang="scss" scoped>
  #bar {
    background-color: #202225;
  }
</style>
