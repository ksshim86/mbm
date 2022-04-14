<template>
  <q-bar
    id="bar"
    class="text-white non-selectable no-pointer-events"
  >
    <div>
      <q-icon
        name="preview"
        size="24px"
        class="q-mr-sm"
        color="orange"
      />Preview</div>
    <q-space />
    <q-btn
      dense
      flat
      icon="minimize"
    />
    <q-btn
      dense
      flat
      icon="crop_square"
    />
    <q-btn
      dense
      flat
      icon="close"
    />
  </q-bar>
  <div class="full-height">
    <div class="column">
      <div class="col-auto">
        <div class="row">
          <div class="col-6">1</div>
          <div class="col-6">2</div>
        </div>
      </div>
      <div class="col-auto">
        <div class="row">
          <div class="col-6">3</div>
          <div class="col-6">4</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'PreviewGrid',
  setup () {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
#bar {
  background-color: #202225;
}
</style>