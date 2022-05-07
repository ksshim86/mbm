<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <main-bar />
    </q-header>
    <q-page-container class="bg-dark">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import MainBar from './MainBar.vue'

export default defineComponent({
  components: { MainBar },
  name: 'MainLayout',
  setup () {
    return {
    }
  }
})
</script>
<style lang="scss" scoped>
.container {
  background-color: aliceblue;
}
</style>
