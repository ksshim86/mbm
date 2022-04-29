<template>
  <div class="full-height">
    <div
      v-if="isEdit"
      class="full-height"
    >
      <q-tabs
        v-model="tab"
        class="text-teal"
      >
        <q-tab
          name="input"
          label="Input"
        />
        <q-tab
          name="bookmark"
          label="Bookmark"
        />
      </q-tabs>
      <q-separator />
      <q-tab-panels
        v-model="tab"
        animated
        class="row custom-panels"
      >
        <q-tab-panel
          name="input"
          class="row col justify-center items-center custom-panel q-pa-sm"
        >
          <q-input
            v-model="urlInput"
            type="text"
            dense
            hint="input url"
            class="custom-input q-pb-md"
          >
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                icon="send"
                @click="handleUrlInputClicked"
              />
            </template>
          </q-input>
        </q-tab-panel>

        <q-tab-panel
          name="bookmark"
          class="row col justify-center items-center custom-panel q-pa-sm"
        >
          <q-select
            dense
            :model-value="model"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="options"
            @filter="filterFn"
            @input-value="setModel"
            hint="Text autocomplete"
            class="custom-input"
            disable
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <webview
      v-else
      ref="webview"
      class="full-height full-width"
      :id="`webview${rowIdx}-${colIdx}`"
      :src="urlInput"
      allowpopups
      webPreferences="nativeWindowOpen"
      :partition="`partition${rowIdx}-${colIdx}`"
    >
    </webview>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + ' ' + i)
  }
  return acc
}, [])

export default defineComponent({
  name: 'UrlSelect',
  props: {
    carouselIdx: Number,
    rowIdx: Number,
    colIdx: Number,
  },
  setup () {
    const model = ref(null)
    const options = ref(stringOptions)
    const urlInput = ref('')
    const isEdit = ref(true)
    const handleUrlInputClicked = () => {
      isEdit.value = false
    }

    // const idx = `${carouselIdx}-${rowIdx}-${colIdx}`

    // window.myWindowAPI.receive(`editOn-${idx}`, function (args) {
    //   isEdit.value = true
    // })

    return {
      isEdit,
      urlInput,
      model,
      options,
      tab: ref('input'),
      filterFn (val, update, abort) {
        update(() => {
          const needle = val.toLocaleLowerCase()
          options.value = stringOptions.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
        })
      },
      handleUrlInputClicked,
      setModel (val) {
        model.value = val
      },
    }
  },
  created () {
    const idx = `${this.carouselIdx}-${this.rowIdx}-${this.colIdx}`

    window.myWindowAPI.receive(`controlSelectUrlOn-${idx}`, function (args) {
      this.isEdit = true
    }.bind(this))

    window.myWindowAPI.receive(`zoomIn-${idx}`, function (args) {
      const webview = this.$refs.webview
      const zoomLevel = Number(webview.getZoomLevel())
      webview.setZoomLevel(zoomLevel + 1)
    }.bind(this))

    window.myWindowAPI.receive(`zoomOut-${idx}`, function (args) {
      const webview = this.$refs.webview
      const zoomLevel = Number(webview.getZoomLevel())
      webview.setZoomLevel(zoomLevel - 1)
    }.bind(this))
  },
})
</script>

<style lang="scss" scoped>
.custom-tab {
  max-width: calc(100vh - 100px);
  height: 80px;
}

.custom-panels {
  height: calc(100% - 50px);
}

.custom-panel {
  width: auto;
  height: calc(100% - 16px);
}

.custom-input {
  width: 100% !important;
  min-width: 165px !important;
  max-width: 400px !important;
}
</style>