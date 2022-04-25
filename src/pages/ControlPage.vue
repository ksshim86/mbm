<template>
  <div>
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
        />Control</div>
      <q-space />
      <q-btn
        dense
        flat
        icon="close"
        @click="closeApp"
      />
    </q-bar>
    <q-btn @click="controlEditOn">1-1-1 재입력 버튼</q-btn>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'ControlPage',
  setup () {
    return {
      controlEditOn () {
        window.myWindowAPI.controlEditOn('1-1-1')
      },
    }
  }
})
</script>

<style lang="scss" scoped>
#bar {
  background-color: #202225;
}
</style>