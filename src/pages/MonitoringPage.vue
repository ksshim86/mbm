<template>
  <q-page>
    <div class="monitoring edit-mode">
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        animated
        infinite
        navigation
        arrows
        control-type="push"
        control-color="orange"
        :autoplay="false"
        class="full-height custom-carousel"
        padding
      >
        <q-carousel-slide
          v-for="carouselIdx in carouselCount"
          :key="carouselIdx"
          :name="carouselIdx"
          class="column full-height"
        >
          <!-- no-padding -->
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
                <q-tabs
                  v-model="tab"
                  class="text-teal"
                >
                  <q-tab name="input" label="Input" />
                  <q-tab name="bookmark" label="Bookmark" />
                </q-tabs>
                <q-separator />
                <q-input
                  type="text"
                  dense
                  hint="input url"
                  class="q-pb-md"
                  style="max-width: 200px"
                />
                <!-- <q-select
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
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select> -->
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
    <q-footer>
      <q-btn-group spread>
        <q-btn
          color="dark"
          text-color="orange"
          label="Back"
          icon="arrow_back"
          @click="handlePrevBtnClicked"
        />
        <q-btn
          color="dark"
          text-color="orange"
          label="Done"
          icon="done"
        />
      </q-btn-group>
    </q-footer>
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

    const router = useRouter()
    const route = useRoute()

    const carouselCount = ref(Number(route.params.carouselCount))
    const carouselInterval = ref(Number(route.params.carouselInterval))
    const rowCount = ref(Number(route.params.rowCount))
    const colCount = ref(Number(route.params.colCount))

    return {
      model,
      options,
      tab: ref('input'),
      filterFn (val, update, abort) {
        update(() => {
          const needle = val.toLocaleLowerCase()
          options.value = stringOptions.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
        })
      },

      setModel (val) {
        model.value = val
      },

      handlePrevBtnClicked () {
        router.push('/preview')
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
.monitoring-header {
  margin-top: 32px;
}

.monitoring {
  height: calc(100vh - 68px);
}

.custom-col {
  border: 1px solid;
  background-color: white;
}

.edit-mode {
  padding: 40px;
}

.custom-carousel {
  background-color: aliceblue;
}

.custom-tab {
  max-width: calc(100vh - 100px);
  height: 80px;
}
</style>