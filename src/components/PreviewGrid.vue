<template>
  <div class="full-height">
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
    <div class="preview-grid">
      <div class="column full-height">
        <div :class="rowClass">
          <div class="row">
            <div class="col-6">1</div>
            <div class="col-6">2</div>
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-6">3</div>
            <div class="col-6">4</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'PreviewGrid',
  props: {
    gridCount: Number,
    rowCount: Number,
    colCount: Number,
  },
  computed: {
    rowClass () {
      const rowMaxClassNum = 12
      return `col-${rowMaxClassNum / this.rowCount}`
    },
  },
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

.preview-grid {
  height: calc(100% - 32px);
  width: 100;
}
</style>