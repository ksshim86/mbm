<template>
  <q-page>
    <div :class="pageClass">
      <vue-agile
        :dots="false"
        :infinite="false"
        :autoplay="false"
        :centerMode="false"
        :autoplay-speed="1000"
        class="full-height"
      >
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
      </vue-agile>
    </div>
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
import { VueAgile } from 'vue-agile'
import UrlSelect from 'src/components/UrlSelect.vue'

export default defineComponent({
  name: 'MonitoringPage',
  components: { UrlSelect, VueAgile },
  computed: {
    pageClass () {
      return this.isDone ? 'monitoring-done' : 'monitoring edit-mode'
    },
    rowClass () {
      const rowMaxClassNum = 12
      // return `col-${rowMaxClassNum / this.rowCount}`
      return 'row'
    },
    colClass () {
      const colMaxClassNum = 12
      return `col-${colMaxClassNum / this.colCount} custom-col`
    },
    millisecond () {
      return this.carouselInterval * 1000
    },
    carouselSlideClass () {
      return this.isDone ? 'column full-height no-padding' : 'column full-height'
    },
    autoplay () {
      return this.isDone ? this.millisecond : false
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
.monitoring-header {
  margin-top: 32px;
}

.monitoring {
  height: calc(100vh - 68px);
}

.monitoring-done {
  height: calc(100vh - 32px);
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

.custom-panels {
  height: calc(100% - 48px);
}
</style>