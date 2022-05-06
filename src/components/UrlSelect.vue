<template>
  <div class="full-height">
    <div
      v-show="isEdit"
      class="full-height"
    >
      <q-tabs
        v-model="tab"
        class="bg-dark text-orange"
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
            color="orange"
            dense
            hint="input url"
            class="custom-input q-pb-md"
          >
            <template v-slot:after>
              <q-btn
                color="orange"
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
            v-model="model"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="options"
            @filter="filterFn"
            hint="Text autocomplete"
            class="custom-input"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:after>
              <q-btn
                color="orange"
                round
                dense
                flat
                icon="send"
                @click="handleUrlInputClicked"
              />
            </template>
          </q-select>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <webview
      v-show="!isEdit"
      ref="webview"
      class="full-height full-width"
      :id="`webview${rowIdx}-${colIdx}`"
      :src="webViewUrl"
      allowpopups
      webPreferences="nativeWindowOpen"
      :partition="`partition${rowIdx}-${colIdx}`"
    >
    </webview>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'UrlSelect',
  props: {
    carouselIdx: Number,
    rowIdx: Number,
    colIdx: Number,
    bookmarks: [],
  },
  setup (props) {
    const tab = ref('input')
    const model = ref(null)
    const urlInput = ref('')
    const webViewUrl = ref('')
    const isEdit = ref(true)
    const options = ref(props.bookmarks)

    const filterFn = function (val, update, abort) {
      const bookmarks = props.bookmarks
      update(function () {
        const needle = val.toLocaleLowerCase()
        options.value = bookmarks.filter(v => v.value.toLocaleLowerCase().indexOf(needle) > -1)
      })
    }

    const handleUrlInputClicked = () => {
      if (tab.value === 'input') {
        webViewUrl.value = urlInput.value
      } else {
        webViewUrl.value = model.value.value
      }

      isEdit.value = false
    }

    const webview = ref(null)

    onMounted(() => {
      const idx = `${props.carouselIdx}-${props.rowIdx}-${props.colIdx}`

      const selectUrlOnFunc = function (args) {
        isEdit.value = true
      }

      const zoomInFunc = function (args) {
        const zoomLevel = Number(webview.value.getZoomLevel())
        webview.value.setZoomLevel(zoomLevel + 1)
      }

      const zoomOutFunc = function (args) {
        const zoomLevel = Number(webview.value.getZoomLevel())
        webview.value.setZoomLevel(zoomLevel - 1)
      }

      window.myWindowAPI.receive(`controlSelectUrlOn-${idx}`, selectUrlOnFunc)
      window.myWindowAPI.receive(`zoomIn-${idx}`, zoomInFunc)
      window.myWindowAPI.receive(`zoomOut-${idx}`, zoomOutFunc)
    })

    return {
      webview,
      options,
      isEdit,
      urlInput,
      webViewUrl,
      model,
      tab,
      filterFn,
      handleUrlInputClicked,
    }
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