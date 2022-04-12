<template>
  <div class="fixed-center">
    <div class="row text-center">
      <div class="col">
        <div class="text-h4">
          <q-icon name="dashboard" size="40px" class="q-mb-sm" color="orange" />
          Multi Browser Monitoring
          <q-badge align="top" color="orange" text-color="black">v1.0.2</q-badge>
        </div>
      </div>
    </div>
    <div class="row text-center q-mt-lg">
      <div class="col">
        <q-btn class="full-width" color="orange" text-color="black" label="Start" @click="handleStartBtnClicked" />
      </div>
    </div>
    <div class="row text-center q-mt-lg">
      <div class="col-sm-6 q-pr-sm">
        <q-btn class="full-width" color="orange" text-color="black" label="Favorite Layout" />
      </div>
      <div class="col-sm-6 q-pl-sm">
        <q-btn class="full-width" color="orange" text-color="black" label="Bookmark" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  methods: {
    handleStartBtnClicked () {
      this.$router.push('/start')
    },
  }
})
</script>
