<template>
  <div class="full-height">
    <div v-if="!isInput">
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
      >
        <q-tab-panel
          name="input"
          class="q-pa-sm"
        >
          <q-input
            v-model="urlInput"
            type="text"
            dense
            hint="input url"
            class="q-pb-md"
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

        <q-tab-panel name="bookmark">
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
    const isInput = ref(false)
    const handleUrlInputClicked = () => {
      isInput.value = true
    }

    return {
      isInput,
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
  }
})
</script>

<style>
</style>