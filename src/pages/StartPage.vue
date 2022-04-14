<template>
  <q-page class="q-pa-md">
    <div class="row text-center">
      <div class="col-2">
      </div>
      <div class="col-8 preview-col">
        <div class="text-h4">
          <q-bar
            id="bar"
            class="text-white non-selectable no-pointer-events"
          >
            <div>
              <q-icon
                name="preview"
                size="24px"
                class="q-mr-sm"
                color="orange"
              />Preview</div>
            <q-space />
            <q-btn
              dense
              flat
              icon="minimize"
            />
            <q-btn
              dense
              flat
              icon="crop_square"
            />
            <q-btn
              dense
              flat
              icon="close"
            />
          </q-bar>
        </div>
      </div>
      <div class="col-2">
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-2">
      </div>
      <div class="col-8">
        <q-badge color="secondary">
          Grid Count: {{ gridCount }}
        </q-badge>
        <q-slider
          v-model="gridCount"
          markers
          marker-labels
          :min="1"
          :max="3"
          color="orange"
        >
        </q-slider>
        <q-badge color="secondary">
          Row Count: {{ rowCount }}
        </q-badge>
        <q-slider
          v-model="rowCount"
          markers
          marker-labels
          :min="1"
          :max="3"
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
          :max="3"
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

export default defineComponent({
  name: 'StartPage',
  setup () {
    const gridCount = ref(1)
    const rowCount = ref(1)
    const colCount = ref(1)

    return {
      gridCount,
      rowCount,
      colCount,
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
  height: calc(100vh - 50vh);
}
</style>