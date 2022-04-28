<template>
  <q-page>
    <swiper
      ref="swiper"
      :navigation="!isDone && carouselCount > 1"
      :modules="modules"
      :allowTouchMove="false"
      :loop="true"
      :autoplay="swiperAutoplay"
      :pagination="isPagination"
      :spaceBetween="50"
      :class="swiperClass"
      @swiper="setSwiperRef"
    >
      <swiper-slide
        v-for="carouselIdx in carouselCount"
        :key="carouselIdx"
      >
        <div class="column fit">
          <div
            v-for="rowIdx in rowCount"
            :key="rowIdx"
            :class="rowClass"
          >
            <div class="row fit">
              <div
                v-for="colIdx in colCount"
                :key="colIdx"
                :class="colClass"
              >
                <div class="full-height custom-col">
                  <url-select
                    :carouselIdx=carouselIdx
                    :rowIdx=rowIdx
                    :colIdx=colIdx
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <q-footer v-if="!isDone">
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
          @click="handleDoneBtnClicked"
        />
      </q-btn-group>
    </q-footer>
  </q-page>
</template>

<script>
import { ref, defineComponent, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMonitoringStore } from 'stores/monitoring'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, Pagination, Navigation } from 'swiper'
import UrlSelect from 'src/components/UrlSelect.vue'

export default defineComponent({
  name: 'MonitoringPage',
  components: {
    Swiper,
    SwiperSlide,
    UrlSelect,
  },
  setup () {
    const $store = useMonitoringStore()
    const router = useRouter()
    const route = useRoute()

    const carouselCount = ref(Number(route.params.carouselCount))
    const carouselInterval = ref(Number(route.params.carouselInterval))
    const rowCount = ref(Number(route.params.rowCount))
    const colCount = ref(Number(route.params.colCount))

    const isDone = ref(false)
    watch(isDone, function (to, from) {
      $store.setIsDone(to)
    }.bind(this))

    const swiperRef = ref(null)
    const setSwiperRef = (swiper) => {
      swiper.autoplay.stop()
      swiperRef.value = swiper
    }

    const handleDoneBtnClicked = () => {
      isDone.value = true
      swiperRef.value.autoplay.start()

      window.myWindowAPI.sendMonitoringProps({
        carouselCount: carouselCount.value,
        carouselInterval: carouselInterval.value,
        rowCount: rowCount.value,
        colCount: colCount.value,
      })
    }

    return {
      modules: [Autoplay, Pagination, Navigation],
      setSwiperRef,
      swiperRef,
      isDone,
      handlePrevBtnClicked () {
        router.push('/preview')
      },
      handleDoneBtnClicked,
      carouselCount,
      carouselInterval,
      rowCount,
      colCount,
      slide: ref(1),
      router,
    }
  },
  created () {
    window.myWindowAPI.receive('back', function (args) {
      this.router.push('/preview')
    }.bind(this))

    window.myWindowAPI.receive('controlEditModeOn', function (args) {
      this.isDone = false
      this.swiperRef.autoplay.stop()
    }.bind(this))
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
    millisecond () {
      return this.carouselInterval * 1000
    },
    carouselSlideClass () {
      return this.isDone ? 'column full-height no-padding' : 'column full-height'
    },
    isPagination () {
      return this.isDone ? false : { clickable: true }
    },
    swiperClass () {
      return this.isDone ? 'done-mode' : 'edit-mode'
    },
    swiperAutoplay () {
      if (this.carouselCount > 1) {
        return { delay: this.millisecond, disableOnInteraction: false }
      } else {
        return false
      }
    }
  },
})
</script>

<style lang="scss" scoped>
.done-mode {
  height: calc(100vh - 32px);
}

.edit-mode {
  height: calc(100vh - 68px);
  padding: 48px;
}

.custom-col {
  border: 1px solid;
  background-color: white;
}

.custom-carousel {
  background-color: aliceblue;
}

.custom-tab {
  max-width: calc(100vh - 100px);
  height: 80px;
}

.custom-panels {
  height: calc(100% - 48px);
}
</style>