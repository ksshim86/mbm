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
          style="height: 480px; width: 510px;"
          color="orange"
        >
          <template v-slot:top>
            <q-btn
              outline
              icon="bookmark_add"
              color="orange"
              text-color="orange"
              label="Add bookmark"
              @click="card = true"
            />
            <q-space />
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
                key="name"
                :props="props"
                style="text-align: center !important; width: 20px;"
              >
                {{ props.rowIndex + 1 }}
              </q-td>
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
                  @click="deleteBookmark(props.row.id)"
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
    <q-dialog
      v-model="card"
      persistent
      no-shake
      @show="onShow"
      @hide="onHide"
    >
      <q-card style="width: 300px;">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis text-orange">
              <q-icon
                name="bookmark_add"
                class="q-mb-sm"
                size="32px"
                color="orange"
              />
              Add Bookmark
            </div>
          </div>
        </q-card-section>
        <q-form
          @submit="saveBookmark"
          ref="newForm"
        >
          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">
              Name
            </div>
            <div class="q-pb-md">
              <q-input
                v-model="newBookmark.name"
                type="text"
                color="orange"
                dense
                :rules="[
                  val => !!val || 'Name is required',
                  val => val.length <= 10 || 'Please use maximum 10 characters'
                ]"
              />
            </div>
            <div class="text-subtitle1">
              Url
            </div>
            <div class="q-pb-md">
              <q-input
                v-model="newBookmark.url"
                type="text"
                color="orange"
                dense
                :rules="[val => !!val || 'Url is required']"
              />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              v-close-popup
              flat
              color="orange"
              icon="close"
              label="Cancel"
            />
            <q-btn
              flat
              color="orange"
              icon="done"
              label="Save"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, defineComponent, watch } from 'vue'
import { useMonitoringStore } from 'stores/monitoring'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const columns = [
  { name: '#', label: '#', field: 'index', align: 'center', sortable: true, },
  { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'url', label: 'Url', align: 'left', field: 'url', sortable: true },
]

export default defineComponent({
  name: 'BookmarkPage',
  setup () {
    const router = useRouter()
    const store = useMonitoringStore()
    const quasar = useQuasar()
    const { bookmarks } = storeToRefs(store)
    const filter = ref('')
    const newBookmark = ref({
      name: '',
      url: '',
    })
    const card = ref(false)
    const newForm = ref(null)
    let itemKey = -1

    watch(bookmarks, async (to) => {
      if (itemKey > -1) {
        const bookmark = JSON.parse(JSON.stringify(to[itemKey - 1]))
        await store.updateBookmark(bookmark)
        itemKey = -1
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

    const saveBookmark = async () => {
      await store.insertBookmark(JSON.parse(JSON.stringify(newBookmark.value)))
      card.value = false
    }

    const deleteBookmark = (id) => {
      quasar.dialog({
        title: 'Delete',
        message: 'Would you like to turn on the wifi?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await store.deleteBookmark(id)
      })
    }

    const onShow = () => {
      newForm.value.focus()
    }
    const onHide = () => {
      newBookmark.value = {
        name: '',
        url: '',
      }
    }

    return {
      quasar,
      columns,
      bookmarks,
      pagination: ref({
        rowsPerPage: 0
      }),
      filter,
      card,
      newForm,
      newBookmark,
      async fetchBookmarks () {
        await store.fetchBookmarks()
      },
      handleBackBtnClicked,
      editingName,
      editingUrl,
      saveBookmark,
      deleteBookmark,
      onShow,
      onHide,
    }
  },
  created () {
    this.fetchBookmarks()
    this.isFetch = true
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