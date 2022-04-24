<template>
  <q-page>
    <swiper
      :navigation="!isDone"
      :modules="modules"
      :loop="true"
      :autoplay="swiperAutoplay"
      :pagination="isPagination"
      :spaceBetween="50"
      :class="swiperClass"
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
                <div class="row fit justify-center items-center content-center custom-col">
                  {{carouselIdx}} x {{rowIdx}} x {{colIdx}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- <div :class="pageClass">
      <div
        v-for="carouselIdx in carouselCount"
        :key="carouselIdx"
      >
        <div
          v-for="rowIdx in rowCount"
          :key="rowIdx"
          :class="rowClass"
        >
          <div
            v-for="colIdx in colCount"
            :key="colIdx"
            :class="colClass"
          >
            <url-select
              :carousel-idx=carouselIdx
              :row-idx=rowIdx
              :col-idx=colIdx
            />
          </div>
        </div>
      </div>
    </div> -->
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
          @click="isDone = true"
        />
      </q-btn-group>
    </q-footer>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, Pagination, Navigation } from 'swiper'
// import UrlSelect from 'src/components/UrlSelect.vue'

export default defineComponent({
  name: 'MonitoringPage',
  components: { 
    Swiper,
    SwiperSlide,
    // UrlSelect,
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
      return this.isDone ? {delay: this.millisecond, disableOnInteraction: false} : {delay: 99999999, disableOnInteraction: false}
    }
  },
  setup () {
    const router = useRouter()
    const route = useRoute()

    const carouselCount = ref(Number(route.params.carouselCount))
    const carouselInterval = ref(Number(route.params.carouselInterval))
    const rowCount = ref(Number(route.params.rowCount))
    const colCount = ref(Number(route.params.colCount))

    return {
      modules: [Autoplay, Pagination, Navigation],
      isDone: ref(false),
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
.done-mode {
  height: calc(100vh - 32px);
}

.edit-mode {
  height: calc(100vh - 68px);
  padding: 32px;
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