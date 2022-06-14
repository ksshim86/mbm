<template>
  <div class="full-height">
    <div
      v-if="isEdit"
      class="full-height"
    >
      <q-tabs
        v-model="tab"
        class="bg-dark text-orange"
      >
        <q-tab
          name="bookmark"
          label="Bookmark"
        />
        <q-tab
          name="input"
          label="Input"
        />
      </q-tabs>
      <q-separator />
      <q-tab-panels
        v-model="tab"
        animated
        class="row custom-panels"
      >
        <q-tab-panel
          name="bookmark"
          class="row col justify-center items-center custom-panel q-pa-sm"
        >
          <q-select
            dense
            v-model="selectedBookmark"
            use-input
            hide-selected
            fill-input
            color="orange"
            input-debounce="0"
            :options="options"
            @filter="filterFn"
            hint="Text autocomplete"
            class="custom-input"
            @keyup.enter="handleUrlInputClicked"
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
            @keyup.enter="handleUrlInputClicked"
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
      </q-tab-panels>
    </div>
    <webview
      v-else
      ref="webview"
      class="full-height full-width"
      :id="`webview${rowIdx}-${colIdx}`"
      :src="webViewUrl"
      allowpopups
      webPreferences="nativeWindowOpen=yes"
      :partition="`partition${rowIdx}-${colIdx}`"
    >
    </webview>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted, toRefs, watch } from 'vue'

export default defineComponent({
  name: 'UrlSelect',
  props: {
    isFavorite: Boolean,
    slideIdx: Number,
    rowIdx: Number,
    colIdx: Number,
    bookmarks: Array,
    favoriteUrls: Object,
  },
  setup (props) {
    const tab = ref('bookmark')
    const selectedBookmark = ref(null)
    const urlInput = ref('')
    const webViewUrl = ref('')
    const isEdit = ref(true)
    const options = ref(props.bookmarks)
    const favoriteUrls = ref(props.favoriteUrls)

    watch(props.bookmarks, (to) => {
      if (props.isFavorite) {
        tab.value = favoriteUrls.value.tab

        if (tab.value === 'bookmark') {
          selectedBookmark.value = options.value.find((o) => o.id == favoriteUrls.value.bookmarkId)
        } else {
          urlInput.value = favoriteUrls.value.url
        }

        handleUrlInputClicked()
      }
    }, { deep: true })

    const filterFn = function (val, update, abort) {
      const bookmarks = props.bookmarks
      update(function () {
        const needle = val.toLocaleLowerCase()
        options.value = bookmarks.filter(v => v.value.toLocaleLowerCase().indexOf(needle) > -1)
      })
    }

    const handleUrlInputClicked = () => {
      if (urlInput.value.length > 0 || selectedBookmark.value !== undefined) {
        if (tab.value === 'input') {
          webViewUrl.value = urlInput.value
        } else {
          if (selectedBookmark.value !== undefined) {
            webViewUrl.value = selectedBookmark.value.value
          }
        }

        isEdit.value = false
      }
    }

    const webview = ref(null)

    onMounted(() => {
      const idx = `${props.slideIdx}-${props.rowIdx}-${props.colIdx}`

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

    let tempIdx = Number(`${props.slideIdx}${props.rowIdx}${props.colIdx}`)
    let tempTab = tab.value
    let tempUrl = ''
    let tempBookmarkId = null

    if (props.isFavorite) {
      tempIdx = favoriteUrls.value.idx
      tempTab = favoriteUrls.value.tab
      tempUrl = favoriteUrls.value.url
      tempBookmarkId = favoriteUrls.value.bookmarkId
    }

    window.myWindowAPI.setFavoriteUrl(
      {
        idx: tempIdx,
        tab: tempTab,
        url: tempUrl,
        bookmarkId: tempBookmarkId,
      }
    )

    /**
     * webview에 바인딩에 되는 url이 변경되면
     * 해당 정보를 main에 넘긴다
     */
    watch(webViewUrl, (to) => {
      let idx = Number(`${props.slideIdx}${props.rowIdx}${props.colIdx}`)
      let bookmarkId = null

      if (tab.value === 'bookmark') {
        bookmarkId = selectedBookmark.value.id
      }

      if (props.isFavorite) {
        idx = favoriteUrls.value.idx
      }

      window.myWindowAPI.setFavoriteUrl(
        {
          idx: idx,
          tab: tab.value,
          url: urlInput.value,
          bookmarkId: bookmarkId,
        }
      )
    })

    return {
      webview,
      options,
      isEdit,
      urlInput,
      webViewUrl,
      selectedBookmark,
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