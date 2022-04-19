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
                <!-- {{ carouselIdx }} x {{ rowIdx }} x {{ colIdx }} -->
                <q-select
                  dense
                  :model-value="model"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  :options="options"
                  @filter="filterFn"
                  @input-value="setModel"
                  hint="Text autocomplete"
                  style="width: 250px; padding-bottom: 32px"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <!-- <webview
                  class="full-height full-width"
                  :id="`webview${rowIdx}-${colIdx}`" 
                  src="https://google.com" 
                  allowpopups
                  webPreferences="nativeWindowOpen" 
                  :partition="`partition${rowIdx}-${colIdx}`">
                </webview> -->
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

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + ' ' + i)
  }
  return acc
}, [])

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
    const model = ref(null)
    const options = ref(stringOptions)

    const route = useRoute()

    const carouselCount = ref(Number(route.params.carouselCount))
    const carouselInterval = ref(Number(route.params.carouselInterval))
    const rowCount = ref(Number(route.params.rowCount))
    const colCount = ref(Number(route.params.colCount))

    return {
      model,
      options,

      filterFn (val, update, abort) {
        update(() => {
          const needle = val.toLocaleLowerCase()
          options.value = stringOptions.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
        })
      },

      setModel (val) {
        model.value = val
      },

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