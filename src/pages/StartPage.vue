<template>
  <q-page>
    <div class="row text-center">
      <div class="col-2">
      </div>
      <div class="col-8 preview-col" style="height: 50%;">
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
        <q-input outlined v-model="text" label="Outlined" />
        <q-input outlined v-model="text" label="Outlined" />
        <q-input outlined v-model="text" label="Outlined" />
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StartPage'
})
</script>

<style lang="scss" scoped>
  #bar {
    background-color: #202225;
  }

  .preview-col {
    border: 1px solid;
  }
</style>