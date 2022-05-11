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
        v-if="editIsDone"
        v-model="toggleControl"
        color="orange"
        dense
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
import { useRoute } from 'vue-router'
import { useMonitoringStore } from 'stores/monitoring'
import { storeToRefs } from 'pinia'

export default {
  name: 'MainBar',
  setup () {
    const store = useMonitoringStore()
    const { isDone } = storeToRefs(store)
    const route = useRoute()
    const editIsDone = ref(false)
    watch(route, function (to, from, next) {
      editIsDone.value = store.getIsDone
    }.bind(this), { flush: 'pre', immediate: true, deep: true })

    watch(isDone, function (to, from) {
      editIsDone.value = to
      if (!to) {
        toggleControl.value = false
      }
    })

    const toggleControl = ref(false)
    watch(toggleControl, (newVal) => {
      store.setToggleControl(newVal)
      window.myWindowAPI.toggleControl(newVal)
    })

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
      store,
      editIsDone,
      route,
      toggleControl,
      minimize,
      toggleMaximize,
      closeApp,
    }
  },
  created () {
    window.myWindowAPI.receive('controlWindowClose', function () {
      this.toggleControl = false
    }.bind(this))
  },
}
</script>
<style lang="scss" scoped>
#bar {
  background-color: #202225;
}
</style>
