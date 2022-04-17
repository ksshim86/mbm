<template>
  <q-page class="q-pa-md">
    <div class="row text-center">
      <div class="col-2">
      </div>
      <div class="col-8 preview-col">
        <preview-mbm
          :carousel-count=carouselCount
          :row-count=rowCount
          :col-count=colCount
          :carousel-interval="carouselInterval"
        />
      </div>
      <div class="col-2">
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-2">
      </div>
      <div class="col-8">
        <q-badge color="secondary">
          Carousel Count: {{ carouselCount }}
        </q-badge>
        <q-slider
          v-model="carouselCount"
          markers
          marker-labels
          :min="1"
          :max="3"
          color="orange"
        >
        </q-slider>
        <q-badge color="secondary">
          Carousel Interval: {{ carouselInterval }} sec
        </q-badge>
        <q-input
          v-model.number="carouselInterval"
          type="number"
          label-color="orange"
          dense
          min="1"
          suffix="sec"
          class="q-pb-md"
          style="max-width: 100px"
        />
        <q-badge color="secondary">
          Row Count: {{ rowCount }}
        </q-badge>
        <q-slider
          v-model="rowCount"
          markers
          marker-labels
          :min="1"
          :max="4"
          color="orange"
        >
        </q-slider>
        <q-badge color="secondary">
          Col Count: {{ colCount }}
        </q-badge>
        <q-slider
          v-model="colCount"
          markers
          marker-labels
          :min="1"
          :max="4"
          color="orange"
        >
        </q-slider>
      </div>
      <div class="col-2">
      </div>
    </div>
    <q-footer>
      <q-btn-group spread>
        <q-btn
          color="dark"
          text-color="orange"
          label="Back"
          icon="arrow_back"
          @click="handleBackBtnClicked"
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
import PreviewMbm from 'src/components/PreviewMbm.vue'
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { PreviewMbm },
  name: 'StartPage',
  setup () {
    const router = useRouter()
    const carouselCount = ref(1)
    const rowCount = ref(1)
    const colCount = ref(1)
    const carouselInterval = ref(30)

    const handleBackBtnClicked = () => {
      router.push('/')
    }

    return {
      carouselCount,
      carouselInterval,
      rowCount,
      colCount,
      handleBackBtnClicked,
    }
  }
})
</script>

<style lang="scss" scoped>
#bar {
  background-color: #202225;
}

.preview-col {
  height: calc(100vh - 60vh);
}

.preview {
  height: calc(100vh);
  display: inherit;
}
</style>