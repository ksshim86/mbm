<template>
  <q-page>
    <swiper
      ref="swiper"
      :navigation="!isDone && carouselCount > 1"
      :modules="modules"
      :allowTouchMove="false"
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
          class="bg-deepDark"
          text-color="orange"
          label="Prev"
          icon="arrow_back"
          @click="handlePrevBtnClicked"
        />
        <q-btn
          class="bg-deepDark"
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
import { storeToRefs } from 'pinia'
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
    const { toggleControl } = storeToRefs($store)

    watch(toggleControl, (to) => {
      if (to && swiperRef.value.autoplay !== undefined) {
        swiperRef.value.autoplay.stop()
        swiperRef.value.slideTo(0)
      }

      if (!to && swiperRef.value.autoplay !== undefined) {
        swiperRef.value.autoplay.start()
      }
    },
    )

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

      if (carouselCount.value > 1) {
        swiperRef.value.autoplay.start()
      }

      // 편집이 완료된 경우, 세팅된 값을 main으로 값을 전달한다
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
    }.bind(this))

    // 컨트롤의 슬라이드 변경 시, index를 받아 동기화 한다
    window.myWindowAPI.receive('getSlideIndex', function (args) {
      this.swiperRef.slideTo(args)
    }.bind(this))

    window.myWindowAPI.receive('goMain', function (args) {
      this.isDone = false
      this.router.push('/')
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
      const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      }
      return this.isDone ? false : pagination
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

<style lang="scss">
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

.swiper-pagination-bullet {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #000;
  opacity: 1;
  background: aliceblue;
}

.swiper-pagination-bullet-active {
  color: #fff;
  background: #009688;
}
</style>