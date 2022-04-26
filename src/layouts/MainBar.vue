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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMonitoringStore } from 'stores/monitoring'
export default {
  name: 'MainBar',
  setup () {
    const $store = useMonitoringStore()
    const route = useRoute()
    const editIsDone = ref(false)
    watch(route, function (to, from, next) {
      // console.log(`to: ${to.path} , prevPath: ${prevPath}`)
      // prevPath = to.path
      editIsDone.value = $store.getIsDone
    }.bind(this), { flush: 'pre', immediate: true, deep: true })

    // done 버튼 눌렀을때 변수 따로 관리해서 있어야 할 듯
    // const editIsDone = computed({
    //   get: () => $store.getIsDone,
    // })
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
      editIsDone,
      route,
      toggleControl,
      minimize,
      toggleMaximize,
      closeApp,
    }
  },
}
</script>
<style lang="scss" scoped>
#bar {
  background-color: #202225;
}
</style>
