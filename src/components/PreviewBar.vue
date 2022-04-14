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
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'PreviewBar',
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