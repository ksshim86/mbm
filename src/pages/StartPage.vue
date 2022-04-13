<template>
  <q-page class="q-pa-md">
    <div class="row text-center">
      <div class="col-2">
      </div>
      <div class="col-8 preview-col">
        <div class="text-h4">
          <q-bar id="bar" class="text-white non-selectable no-pointer-events">
            <div><q-icon name="preview" size="24px" class="q-mr-sm" color="orange"/>Preview</div>
            <q-space />
            <q-btn dense flat icon="minimize" />
            <q-btn dense flat icon="crop_square" />
            <q-btn dense flat icon="close" />
          </q-bar>
        </div>
      </div>
      <div class="col-2">
      </div>
    </div>
    <div class="row text-center q-mt-lg">
      <div class="col-2">
      </div>
      <div class="col-8">
        <q-badge color="secondary">
          Grid Count: {{ gridCount }}
        </q-badge>
        <q-slider
          v-model="gridCount"
          label-always
          markers
          marker-labels
          :min="1"
          :max="3"
          color="orange"
        >
          <template v-slot:marker-label-group="scope">
            <div
              v-for="marker in scope.markerList"
              :key="marker.index"
              :class="[ `text-deep-orange-${2 + Math.ceil(marker.value / 2) }`, marker.classes ]"
              :style="marker.style"
              @click="model = marker.value"
            >{{ marker.value }}</div>
          </template>
        </q-slider>
      </div>
      <div class="col-2">
      </div>
    </div>
    <q-footer>
        <q-btn-group spread>
          <q-btn color="dark" text-color="orange" label="Back" icon="arrow_back" />
          <q-btn color="dark" text-color="orange" label="Done" icon="done" />
        </q-btn-group>
    </q-footer>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'StartPage',
  setup() {
    const gridCount = ref(1)

    return {
      gridCount,
    }
  }
})
</script>

<style lang="scss" scoped>
  #bar {
    background-color: #202225;
  }

  .preview-col {
    border: 1px solid;
    height: calc(100vh - 40vh);
  }
</style>