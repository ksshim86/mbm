<template>
  <q-page>
    <div class="fixed-center">
      <div class="row text-center">
        <q-table
          title="Bookmarks"
          :rows="bookmarks"
          :columns="columns"
          row-key="id"
          binary-state-sort
          :filter="filter"
          virtual-scroll
          v-model="pagination"
          :rows-per-page-options="[0]"
          class="my-sticky-header-table"
          style="height: 480px; width: 500px;"
          color="orange"
        >
          <template v-slot:top>
            <q-space />
            <q-input
              label="Search"
              borderless
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
                key="name"
                :props="props"
              >
                {{ props.row.name }}
                <q-popup-edit
                  v-model="props.row.name"
                  v-slot="scope"
                  title="Update name"
                  buttons
                  color="orange"
                  @save="editingName(props)"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    color="orange"
                  />
                </q-popup-edit>
              </q-td>
              <q-td
                key="url"
                :props="props"
              >
                {{ props.row.url }}
                <q-popup-edit
                  v-model="props.row.url"
                  v-slot="scope"
                  title="Update url"
                  buttons
                  color="orange"
                  @save="editingUrl(props)"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    color="orange"
                  />
                </q-popup-edit>
              </q-td>
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="orange"
                  round
                  @click="props.expand = !props.expand"
                  icon="delete"
                />
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
          label="Prev"
          icon="arrow_back"
          @click="handleBackBtnClicked"
        />
      </q-btn-group>
    </q-footer>
  </q-page>
</template>

<script>
import { ref, defineComponent, watch } from 'vue'
import { useMonitoringStore } from 'stores/monitoring'
import { useRouter } from 'vue-router'

const columns = [
  { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'url', label: 'Url', align: 'left', field: 'url', sortable: true },
]

export default defineComponent({
  name: 'BookmarkPage',
  setup () {
    const router = useRouter()
    const store = useMonitoringStore()
    const bookmarks = ref([])
    const filter = ref('')
    let itemKey = -1

    watch(bookmarks, (to) => {
      if (itemKey > -1) {
        // update 치면 된다.
        console.log(to[itemKey - 1])
      }
    }, { deep: true })

    const handleBackBtnClicked = () => {
      router.push('/')
    }

    const editingName = (item) => {
      itemKey = item.key
    }

    const editingUrl = (item) => {
      itemKey = item.key
    }

    return {
      columns,
      bookmarks,
      pagination: ref({
        rowsPerPage: 0
      }),
      filter,
      async fetchBookmarks () {
        await store.fetchBookmarks()
        bookmarks.value = store.bookmarks
        for (let i = 0; i < 1000; i++) {
          bookmarks.value.push({ id: i + 3, name: `foo${i + 3}`, url: `http://foo${i + 3}.com` })
        }

        bookmarks.value.push({ id: '', name: '', url: '' })
      },
      handleBackBtnClicked,
      editingName,
      editingUrl,
    }
  },
  created () {
    this.fetchBookmarks()
  },
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