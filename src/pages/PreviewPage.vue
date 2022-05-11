<template>
  <q-page class="q-pa-md">
    <div class="row text-center">
      <div class="col-2">
      </div>
      <div class="col-8 preview-col">
        <preview-mbm
          :slide-count=slideCount
          :row-count=rowCount
          :col-count=colCount
          :slide-interval="slideInterval"
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
          Slide Count: {{ slideCount }}
        </q-badge>
        <q-slider
          v-model="slideCount"
          markers
          marker-labels
          :min="1"
          :max="3"
          color="orange"
        >
        </q-slider>
        <q-badge color="secondary">
          Slide Interval: {{ slideInterval }} sec
        </q-badge>
        <q-input
          v-model.number="slideInterval"
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
          class="bg-deepDark"
          text-color="orange"
          label="Prev"
          icon="arrow_back"
          @click="handleBackBtnClicked"
        />
        <q-btn
          class="bg-deepDark"
          text-color="orange"
          label="Next"
          icon-right="arrow_forward"
          @click="handleNextBtnClicked"
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
  name: 'PreviewPage',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'monitoring') {
        vm.slideCount = Number(from.params.slideCount)
        vm.slideInterval = Number(from.params.slideInterval)
        vm.rowCount = Number(from.params.rowCount)
        vm.colCount = Number(from.params.colCount)
      }
    })
  },
  setup () {
    const router = useRouter()
    const slideCount = ref(1)
    const slideInterval = ref(30)
    const rowCount = ref(1)
    const colCount = ref(1)

    const handleBackBtnClicked = () => {
      router.push('/')
    }

    const handleNextBtnClicked = () => {
      router.push({
        name: 'monitoring',
        params: {
          isFavorite: false,
          slideCount: slideCount.value,
          slideInterval: slideInterval.value,
          rowCount: rowCount.value,
          colCount: colCount.value,
          urls: [],
        }
      })
    }

    return {
      slideCount,
      slideInterval,
      rowCount,
      colCount,
      handleBackBtnClicked,
      handleNextBtnClicked,
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