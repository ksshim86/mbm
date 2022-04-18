<template>
  <q-page>
    <div class="monitoring">
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
          class="column full-height no-padding">
          <div :class="rowClass" v-for="rowIdx in rowCount" :key="rowIdx">
            <div class="row full-height">
              <div :class="colClass" v-for="colIdx in colCount" :key="colIdx">
              <!-- {{ carouselIdx }} x {{ rowIdx }} x {{ colIdx }} -->
                <webview
                  class="full-height full-width"
                  :id="`webview${rowIdx}-${colIdx}`" 
                  src="https://google.com" 
                  allowpopups
                  webPreferences="nativeWindowOpen" 
                  :partition="`partition${rowIdx}-${colIdx}`">
                </webview>
              </div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'MonitoringPage',
  computed: {
    rowClass () {
      const rowMaxClassNum = 12
      return `col-${rowMaxClassNum / this.rowCount}`
    },
    colClass () {
      const colMaxClassNum = 12
      return `col-${colMaxClassNum / this.colCount} custom-col row justify-center items-center`
    },
    millisecond () {
      return this.carouselInterval * 1000
    },
  },
  setup () {
    const route = useRoute()

    const carouselCount = ref(Number(route.params.carouselCount))
    const carouselInterval = ref(Number(route.params.carouselInterval))
    const rowCount = ref(Number(route.params.rowCount))
    const colCount = ref(Number(route.params.colCount))

    return {
      carouselCount,
      carouselInterval,
      rowCount,
      colCount,
      slide: ref(1),
    }
  }
})
</script>

<style lang="scss" scoped>
.monitoring {
  height: calc(100vh - 32px);
}

.custom-col {
  border: 1px solid;
}
</style>