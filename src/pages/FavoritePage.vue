<template>
  <q-page>
    <div class="fixed-center">
      <q-toolbar class="text-orange">
        <q-toolbar-title>
          Monitoring Favorites
        </q-toolbar-title>
      </q-toolbar>
      <div class="row text-center">
        <q-table
          :rows="favorites"
          :columns="columns"
          row-key="id"
          binary-state-sort
          :filter="filter"
          virtual-scroll
          v-model="pagination"
          :rows-per-page-options="[0]"
          class="my-sticky-header-table"
          style="height: 480px; width: 100%;"
          color="orange"
        >
          <template v-slot:top-right>
            <q-input
              label="Search"
              standout="text-black"
              dense
              debounce="300"
              color="orange"
              v-model="filter"
            >
              <template v-slot:prepend>
                <q-icon
                  name="search"
                  color="orange"
                />
              </template>
            </q-input>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.label }}
              </q-th>
              <q-th auto-width />
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                key="#"
                :props="props"
                style="text-align: center !important; width: 20px;"
              >
                {{ props.rowIndex + 1 }}
              </q-td>
              <q-td
                key="name"
                :props="props"
              >
                {{ props.row.name}}
                <q-popup-edit
                  v-model="props.row.name"
                  v-slot="scope"
                  title="Update name"
                  buttons
                  color="orange"
                  style="width: 330px;"
                  :validate="nameValidation"
                  @hide="nameValidation"
                  @save="editingName(props)"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    color="orange"
                    :error="errorName"
                    :error-message="errorMessageName"
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </q-td>
              <q-td
                v-for="col in props.cols.filter(col => col.name !== '#' && col.name !== 'name')"
                :key="col.name"
                :props="props"
              >
                {{ col.value }}
              </q-td>
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="orange"
                  round
                  flat
                  icon="smart_display"
                  class="q-mr-sm"
                  @click="goMonitoring(props.rowIndex, props.row.id)"
                >
                  <q-tooltip
                    class="bg-deepDark"
                    anchor="center right"
                    self="center left"
                  >start monitoring</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  color="orange"
                  round
                  flat
                  icon="more_vert"
                  class="q-mr-sm"
                  @click="moreFavorite(props.row.id)"
                  disabled
                >
                  <q-tooltip
                    class="bg-deepDark"
                    anchor="center right"
                    self="center left"
                  >more</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  color="orange"
                  round
                  flat
                  @click="deleteFavorite(props.row.id)"
                  icon="delete"
                >
                  <q-tooltip
                    class="bg-deepDark"
                    anchor="center right"
                    self="center left"
                  >delete</q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
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
    <q-dialog
      v-model="moreDialog"
      auto-close
      seamless
    >
      <q-card>
        <q-scroll-area style="height: 400px; width: 300px;">
          <q-card-section>
            <q-list>
              <q-item
                v-for="more in moreFavoriteUrls"
                :key="more.idx"
                class="bg-dark text-orange"
              >
                <q-item-section v-if="more.tab === 'input' && more.url.length > 0">
                  {{ more.url}}
                </q-item-section>
                <q-item-section v-else-if="more.tab === 'bookmark' && more.bookmarkId !== null">
                  {{ more.bookmarkNm }}({{ more.bookmarkUrl }})
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-scroll-area>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            dense
            v-close-popup
            flat
            color="orange"
            icon="close"
            label="Cancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, defineComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const columns = [
  { name: '#', label: '#', field: 'index', align: 'center' },
  { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
  { name: 'slideCount', label: 'Slide count', field: 'slideCount', sortable: true },
  { name: 'slideInterval', label: 'Slide interval', field: 'slideInterval', sortable: true },
  { name: 'rowCount', label: 'Row count', field: 'rowCount', sortable: true },
  { name: 'colCount', label: 'Col count', field: 'colCount', sortable: true },
]

export default defineComponent({
  name: 'FavoritePage',
  setup () {
    const router = useRouter()
    const quasar = useQuasar()
    const favorites = ref([])
    const moreFavoriteUrls = ref([])
    let rowIndex = -1

    watch(favorites, async (to) => {
      if (rowIndex > -1) {
        const favorite = JSON.parse(JSON.stringify(to[rowIndex]))
        const res = await window.myWindowAPI.updateFavorite(favorite)
        rowIndex = -1

        if (res.result) {
          quasar.notify({
            message: 'Update completed',
            type: 'positive',
            textColor: 'dark',
            position: 'bottom-right',
            progress: true,
            timeout: 2500,
          })
        } else {
          quasar.notify({
            message: 'Update failed',
            type: 'negative',
            textColor: 'dark',
            position: 'bottom-right',
            progress: true,
            timeout: 2500,
          })
        }
      }
    }, { deep: true })

    const selectFavorites = async () => {
      const res = await window.myWindowAPI.selectFavorites()
      favorites.value = res.rows
    }

    const goMonitoring = async (rowIndex, id) => {
      const res = await window.myWindowAPI.selectFavoriteUrls(id)
      const item = favorites.value[rowIndex]
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

    const editingName = (item) => {
      rowIndex = item.rowIndex
    }

    const errorName = ref(false)
    const errorMessageName = ref('')
    const nameValidation = (val) => {
      if (val === undefined) {
        errorName.value = false
        errorMessageName.value = ''
        return false
      } else if (val.length === 0) {
        errorName.value = true
        errorMessageName.value = 'Name is required'
        return false
      } else if (val.length > 20) {
        errorName.value = true
        errorMessageName.value = 'Please use maximum 20 characters'
        return false
      }

      errorName.value = false
      errorMessageName.value = ''

      return true
    }

    const deleteFavorite = (id) => {
      quasar.dialog({
        title: '<div class="text-orange">Delete favorite</div>',
        message: 'Are you sure you want to delete this favorite?',
        cancel: true,
        persistent: true,
        noShake: true,
        html: true,
      }).onOk(async () => {
        const res = await window.myWindowAPI.deleteFavorite(id)

        if (res.result) {
          selectFavorites()
          quasar.notify({
            message: 'Delete completed',
            type: 'positive',
            textColor: 'dark',
            position: 'bottom-right',
            progress: true,
            timeout: 2500,
          })
        } else {
          quasar.notify({
            message: 'Delete failed',
            type: 'negative',
            textColor: 'dark',
            position: 'bottom-right',
            progress: true,
            timeout: 2500,
          })
        }
      })
    }

    const moreDialog = ref(false)
    const moreFavorite = async (id) => {
      const res = await window.myWindowAPI.selectFavoriteUrls(id)
      console.log(res.rows)
      moreFavoriteUrls.value = res.rows
      moreDialog.value = true
    }

    return {
      selectFavorites,
      filter: ref(''),
      columns,
      pagination: ref({
        rowsPerPage: 0
      }),
      favorites,
      moreFavoriteUrls,
      goMonitoring,
      handleBackBtnClicked,
      editingName,
      errorName,
      errorMessageName,
      nameValidation,
      deleteFavorite,
      moreDialog,
      moreFavorite,
    }
  },
  async created () {
    this.selectFavorites()
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
</style>