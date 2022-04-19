<template>
  <q-bar
    id="bar"
    class="q-electron-drag text-white"
  >
    <div>
      <q-icon
        name="dashboard"
        size="24px"
        class="q-mr-sm"
        color="orange"
      />Multi Browser Monitoring</div>
    <q-space />
    <q-btn
      dense
      flat
    >
      <q-toggle
        color="orange"
        v-model="toggleControl"
        label="Control On/Off"
        left-label
      />
    </q-btn>
    <q-btn
      dense
      flat
      icon="minimize"
      @click="minimize"
    />
    <q-btn
      dense
      flat
      icon="crop_square"
      @click="toggleMaximize"
    />
    <q-btn
      dense
      flat
      icon="close"
      @click="closeApp"
    />
  </q-bar>
</template>
<script>
import { ref, watch } from 'vue'

export default {
  name: 'MainBar',
  setup () {
    const toggleControl = ref(false)
    watch(toggleControl, (newVal) => {
      window.myWindowAPI.toggleControl(newVal)
    })
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

    return {
      toggleControl,
      minimize,
      toggleMaximize,
      closeApp,
    }
  }
}
</script>
<style lang="scss" scoped>
#bar {
  background-color: #202225;
}
</style>
