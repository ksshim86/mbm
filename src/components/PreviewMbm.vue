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
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        animated
        infinite
        :autoplay="millisecond"
        class="full-height"
      >
        <q-carousel-slide
          v-for="carouselIdx in carouselCount"
          :key="carouselIdx"
          :name="carouselIdx"
          class="column full-height no-padding"
        >
          <div
            :class="rowClass"
            v-for="rowIdx in rowCount"
            :key="rowIdx"
          >
            <div class="row full-height">
              <div
                :class="colClass"
                v-for="colIdx in colCount"
                :key="colIdx"
              >
                {{ carouselIdx }} x {{ rowIdx }} x {{ colIdx }}
              </div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'PreviewMbm',
  props: {
    carouselCount: Number,
    carouselInterval: Number,
    rowCount: Number,
    colCount: Number,
  },
  computed: {
    rowClass () {
      const rowMaxClassNum = 12
      return `col-${rowMaxClassNum / this.rowCount}`
    },
    colClass () {
      const colMaxClassNum = 12
      return `col-${colMaxClassNum / this.colCount} bg-dark custom-col row justify-center items-center`
    },
    millisecond () {
      return this.carouselInterval * 1000
    },
  },
  setup () {
    return {
      slide: ref(1),
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

.custom-col {
  border: 1px solid;
}
</style>