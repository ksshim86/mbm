<template>
  <q-page>
    <div class="row q-pa-md">
      <q-table
        grid
        title="Favorite Monitoring"
        :rows="favorites"
        :columns="columns"
        row-key="name"
        :filter="filter"
        hide-header
        rows-per-page-options=4
        class="my-sticky-header-table full-width"
        style="height: 480px; width: 510px;"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
    <q-footer>
      <q-btn-group spread>
        <q-btn
          class="custom-btn bg-deepDark"
          text-color="orange"
          label="Main"
          icon="first_page"
          @click="handleBackBtnClicked"
        />
      </q-btn-group>
    </q-footer>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

const columns = [
  { name: 'name', align: 'center', label: 'Name', field: 'name'},
  { name: 'slideCount', label: 'Slide count', field: 'slideCount'},
  { name: 'slideInterval', label: 'Slide interval', field: 'slideInterval'},
  { name: 'rowCount', label: 'Row count', field: 'rowCount'},
  { name: 'colCount', label: 'Col count', field: 'colCount'},
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65
  }
]

export default defineComponent({
  name: 'FavoritePage',
  setup () {
    const router = useRouter()
    const favorites = ref([])

    const goMonitoring = async () => {
      const res = await window.myWindowAPI.selectFavoriteUrls(1)
      const item = favorites.value[0]
      const favoriteUrls = {}

      res.rows.forEach((row) => {
        favoriteUrls[`idx${row.idx}`] = row
      })

      router.push({
        name: 'monitoring',
        params: {
          isFavorite: true,
          slideCount: item.slideCount,
          slideInterval: item.slideInterval,
          rowCount: item.rowCount,
          colCount: item.colCount,
          favoriteUrls: JSON.stringify(favoriteUrls),
        }
      })
    }

    const handleBackBtnClicked = () => {
      router.push('/')
    }

    return {
      favorites,
      goMonitoring,
      filter: ref(''),
      columns,
      rows,
      handleBackBtnClicked,
    }
  },
  async created () {
    const res = await window.myWindowAPI.selectFavorites()
    this.favorites = res.rows
  }
})
</script>

<style lang="sass">
.my-sticky-header-table
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #36393f
    color: #ffbc5a

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px

.q-table__grid-item-title
  color: orange
  opacity: 1
</style>