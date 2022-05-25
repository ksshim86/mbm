<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-bar
        id="bar"
        class="q-electron-drag text-white"
      >
        <div>
          <q-spinner-radio
            color="orange"
            size="24px"
            class="q-mr-md"
          />Remote Control</div>
        <q-space />
        <q-btn
          dense
          flat
          icon="close"
          @click="closeChild"
        />
      </q-bar>
    </q-header>
    <q-page-container class="bg-dark">
      <q-page>
        <div class="row">
          <div class="col q-pa-sm">
            <swiper
              :modules="modules"
              :allowTouchMove="false"
              :pagination="paginationOption"
              :spaceBetween="50"
              :autoHeight="true"
              style="padding: 28px;"
              @swiper="setSwiperRef"
            >
              <swiper-slide
                v-for="slideIdx in slideCount"
                :key="slideIdx"
              >
                <div
                  v-for="rowIdx in rowCount"
                  :key="rowIdx"
                  class="q-mb-sm"
                >
                  <q-btn-toggle
                    v-model="toggle"
                    class="q-gutter-x-xs"
                    spread
                    toggle-color="teal"
                    color="orange"
                    text-color="black"
                    :options="options[slideIdx > 1 ? (slideIdx - 1) * rowCount + (rowIdx - 1) : (rowIdx - 1)]"
                  />
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="q-pa-md q-gutter-sm">
          <div class="row">
            <div class="col-6 q-px-sm">
              <q-btn
                class="remote-btn"
                icon="zoom_in"
                label="zoom in"
                color="orange"
                text-color="grey-9"
                :disable="toggle === ''"
                @click="zoomIn"
              />
            </div>
            <div class="col-6 q-px-sm">
              <q-btn
                class="remote-btn"
                icon="replay"
                label="url"
                color="orange"
                text-color="grey-9"
                :disable="toggle === ''"
                @click="controlSelectUrlOn"
              />
            </div>
          </div>
          <div class="row">
            <div class="col q-px-sm">
              <q-btn
                class="remote-btn"
                icon="zoom_out"
                label="zoom out"
                color="orange"
                text-color="grey-9"
                :disable="toggle === ''"
                @click="zoomOut"
              />
            </div>
            <div class="col q-px-sm"></div>
          </div>
        </div>
        <q-footer class="bg-dark q-pa-md text-center">
          <div class="row">
            <div class="col-5 q-px-sm">
              <q-btn
                icon="first_page"
                label="Main"
                color="orange"
                text-color="grey-9"
                @click="goMain"
              />
            </div>
            <div class="col-7 q-px-sm">
              <q-btn
                icon="favorite"
                label="Add favorite"
                color="orange"
                text-color="grey-9"
                @click="card = true"
              />
            </div>
          </div>
        </q-footer>
        <q-dialog
          v-model="card"
          persistent
          no-shake
          @show="onShow"
          @hide="onHide"
        >
          <q-card style="width: 300px;">
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis text-orange">
                  <q-icon
                    name="favorite"
                    class="q-mb-sm"
                    size="32px"
                    color="orange"
                  />
                  Add favorite
                </div>
              </div>
            </q-card-section>
            <q-form
              @submit="addFavorite"
              ref="newForm"
            >
              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  Name
                </div>
                <div class="q-pb-md">
                  <q-input
                    v-model="newFavorite.name"
                    type="text"
                    color="orange"
                    dense
                    :rules="[
                      val => !!val || 'Name is required',
                      val => val.length <= 20 || 'Please use maximum 20 characters'
                    ]"
                  />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="right">
                <q-btn
                  v-close-popup
                  flat
                  color="orange"
                  icon="close"
                  label="Cancel"
                />
                <q-btn
                  flat
                  color="orange"
                  icon="done"
                  label="Save"
                  type="submit"
                />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
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
    const store = useMonitoringStore()
    const quasar = useQuasar()

    const slideCount = ref(0)
    const slideInterval = ref(0)
    const rowCount = ref(0)
    const colCount = ref(0)
    const favoriteUrl = ref(null)
    const options = ref([])
    const paginationOption = ref({
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    })
    const toggle = ref('')

    function closeChild () {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.closeChild()
      }
    }

    const swiperRef = ref(null)
    const setSwiperRef = (swiper) => {
      swiperRef.value = swiper
    }

    const setSlideIndex = (slideIndex) => {
      toggle.value = ''
      store.setSlideIndex(slideIndex)
    }

    const card = ref(false)
    const newFavorite = ref({
      name: ''
    })
    const showFavoriteDialog = () => {
      newForm.value.focus()
    }
    const addFavorite = async () => {
      const res = await window.myWindowAPI.insertFavorite(JSON.parse(JSON.stringify({
        name: newFavorite.value.name,
        slideCount: slideCount.value,
        slideInterval: slideInterval.value,
        rowCount: rowCount.value,
        colCount: colCount.value,
        favoriteUrl: favoriteUrl.value,
      })))

      card.value = false

      if (res.result) {
        quasar.notify({
          message: 'Add completed',
          type: 'positive',
          textColor: 'dark',
          position: 'bottom-right',
          progress: true,
          timeout: 2500,
        })
      } else {
        quasar.notify({
          message: 'Add failed',
          type: 'negative',
          textColor: 'dark',
          position: 'bottom-right',
          progress: true,
          timeout: 2500,
        })
      }
    }

    return {
      quasar,
      card,
      newFavorite,
      store,
      swiperRef,
      setSwiperRef,
      options,
      paginationOption,
      toggle,
      modules: [Autoplay, Pagination, Navigation],
      slideCount,
      slideInterval,
      rowCount,
      colCount,
      favoriteUrl,
      controlEditModeOn () {
        store.setIsDone(false)
        window.myWindowAPI.controlEditModeOn()
      },
      controlSelectUrlOn () {
        if (toggle.value !== '') {
          window.myWindowAPI.controlSelectUrlOn(toggle.value)
        }
      },
      zoomIn () {
        window.myWindowAPI.commandZoomIn(toggle.value)
      },
      zoomOut () {
        window.myWindowAPI.commandZoomOut(toggle.value)
      },
      goMain () {
        window.myWindowAPI.commandGoMain()
      },
      closeChild,
      setSlideIndex,
      showFavoriteDialog,
      addFavorite,
    }
  },
  async created () {
    const { slideCount, slideInterval, rowCount, colCount, favoriteUrl } = await window.myWindowAPI.getMonitoringProps()

    this.slideCount = slideCount
    this.slideInterval = slideInterval
    this.rowCount = rowCount
    this.colCount = colCount
    this.favoriteUrl = favoriteUrl

    for (let i = 1; i <= slideCount; i++) {
      let browserCnt = 1

      for (let j = 1; j <= rowCount; j++) {
        const option = []

        for (let x = 1; x <= colCount; x++) {
          option.push({
            label: browserCnt, value: `${i}-${j}-${x}`
          })

          browserCnt++
        }

        this.options.push(option)
      }
    }

    this.swiperRef.on('slideChange', function (data) {
      this.setSlideIndex(data.activeIndex)
      window.myWindowAPI.setSlideIndex(data.activeIndex)
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
  },
})
</script>
<style>
div.q-btn-group > button:nth-child(1) {
  margin-left: 0px !important;
}
</style>
<style lang="scss">
#bar {
  background-color: #202225;
}

.custom-col {
  border: 1px solid;
  width: 50px;
  height: 50px;
}

.swiper-pagination {
  bottom: 0px !important;
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

.remote-btn {
  width: 100%;
}
</style>