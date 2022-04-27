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
    <div class="row">
      <div class="col q-pa-sm">
        <swiper
          :modules="modules"
          :allowTouchMove="false"
          :pagination="{ clickable: true }"
          :spaceBetween="50"
          :autoHeight="true"
          style="padding: 28px;"
        >
          <swiper-slide
            v-for="carouselIdx in carouselCount"
            :key="carouselIdx"
          >
            <div
              v-for="rowIdx in rowCount"
              :key="rowIdx"
              class="q-mb-sm"
            >
              <q-btn-toggle
                v-model="model"
                class="q-gutter-x-xs"
                spread
                toggle-color="purple"
                color="orange"
                text-color="black"
                :options="options[carouselIdx > 1 ? (carouselIdx - 1) * rowCount + (rowIdx - 1) : (rowIdx - 1)]"
              />
            </div>
            <!-- <div class="column">
              <div
                v-for="rowIdx in rowCount"
                :key="rowIdx"
                :class="rowClass"
              >
                <div class="row justify-center items-center content-center q-gutter-xs">
                  <div class="q-gutter-xs">
                    <q-btn color="brown" label="Button" v-for="colIdx in colCount" :key="colIdx" />
                  </div>
                </div>
              </div>
            </div> -->
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <q-btn @click="controlEditModeOn">에디트 모드 온</q-btn>
    <q-btn @click="controlSelectUrlOn">1-1-1 재입력 버튼</q-btn>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useMonitoringStore } from 'stores/monitoring'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, Pagination, Navigation } from 'swiper'

export default defineComponent({
  name: 'ControlPage',
  components: {
    Swiper,
    SwiperSlide,
  },
  setup () {
    const $store = useMonitoringStore()

    const carouselCount = ref(0)
    const carouselInterval = ref(0)
    const rowCount = ref(0)
    const colCount = ref(0)
    const options = ref([])

    function closeApp () {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.close()
      }
    }

    return {
      options,
      model: ref('0-0-0'),
      modules: [Autoplay, Pagination, Navigation],
      carouselCount,
      carouselInterval,
      rowCount,
      colCount,
      controlEditModeOn () {
        $store.setIsDone(false)
        window.myWindowAPI.controlEditModeOn()
      },
      controlSelectUrlOn () {
        window.myWindowAPI.controlSelectUrlOn('1-1-1')
      },
      closeApp,
    }
  },
  async created () {
    const { carouselCount, carouselInterval, rowCount, colCount } = await window.myWindowAPI.getMonitoringProps()

    this.carouselCount = carouselCount
    this.carouselInterval = carouselInterval
    this.rowCount = rowCount
    this.colCount = colCount

    for (let i = 1; i <= carouselCount; i++) {

      for (let j = 1; j <= rowCount; j++) {
        const option = []

        for (let x = 1; x <= colCount; x++) {
          option.push({
            label: `${i}x${j}x${x}`, value: `${i}x${j}x${x}`
          })
        }

        this.options.push(option)
      }
    }
  },
  computed: {
    rowClass () {
      const rowMaxClassNum = 12
      return `col-${rowMaxClassNum / this.rowCount}`
    },
    colClass () {
      const colMaxClassNum = 12
      return `col-${colMaxClassNum / this.colCount}`
    },
  },
})
</script>
<style>
div.q-btn-group > button:nth-child(1) {
  margin-left: 0px !important;
}
</style>
<style lang="scss" scoped>
#bar {
  background-color: #202225;
}

.custom-col {
  border: 1px solid;
  width: 50px;
  height: 50px;
}
</style>