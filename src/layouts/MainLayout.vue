<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <main-bar />
    </q-header>
    <q-page-container>
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
    const leftDrawerOpen = ref(false)

    return {
    }
  }
})
</script>
