<template>
  <div>
    <q-btn
      label="TEST"
      @click="goMonitoring"
    />
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'FavoritePage',
  setup () {
    const router = useRouter()
    const favorites = ref([])

    const goMonitoring = async () => {
      const res = await window.myWindowAPI.selectFavoriteUrls(1)
      const item = favorites.value[0]
      const urls = {}

      res.rows.forEach((row) => {
        urls[`idx${row.idx}`] = row.url
      })

      router.push({
        name: 'monitoring',
        params: {
          isFavorite: true,
          slideCount: item.slideCount,
          slideInterval: item.slideInterval,
          rowCount: item.rowCount,
          colCount: item.colCount,
          urls: JSON.stringify(urls),
        }
      })
    }

    return {
      favorites,
      goMonitoring,
    }
  },
  async created () {
    const res = await window.myWindowAPI.selectFavorites()
    this.favorites = res.rows
  }
})
</script>

<style>
</style>