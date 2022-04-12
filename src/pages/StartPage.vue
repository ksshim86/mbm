<template>
  <div class="fixed-center">
    <div class="row text-center">
      <div class="col">
        <div class="text-h4">
          <q-bar id="bar" class="q-electron-drag text-white">
            <div><q-icon name="dashboard" size="24px" class="q-mr-sm" color="orange"/>Multi Browser Monitoring</div>
            <q-space />
            <q-btn dense flat icon="minimize" />
            <q-btn dense flat icon="crop_square" />
            <q-btn dense flat icon="close" />
          </q-bar>
        </div>
      </div>
    </div>
    <div class="row text-center q-mt-lg">
      <div class="col">
        <q-input outlined v-model="text" label="Outlined" />
        <q-input outlined v-model="text" label="Outlined" />
        <q-input outlined v-model="text" label="Outlined" />
      </div>
    </div>
  </div>
  <q-footer>
      <q-btn-group spread>
        <q-btn color="orange" label="Back" icon="arrow_back" />
        <q-btn color="orange" label="Done" icon="done" />
      </q-btn-group>
  </q-footer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StartPage'
})
</script>

<style lang="scss" scoped>
  #bar {
    background-color: #202225;
  }
</style>