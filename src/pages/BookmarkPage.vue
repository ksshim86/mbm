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
                  style="width: 250px;"
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
                  :validate="urlValidation"
                  @hide="urlValidation"
                  @save="editingUrl(props)"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    color="orange"
                    :error="errorUrl"
                    :error-message="errorMessageUrl"
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </q-td>
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="orange"
                  round
                  outline
                  @click="deleteBookmark(props.row.id)"
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
          @submit="addBookmark"
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
                :rules="[
                  val => !!val || 'Url is required',
                  val => val.length <= 150 || 'Please use maximum 150 characters'
                ]"
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
  { name: '#', label: '#', field: 'index', align: 'center' },
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
    let rowIndex = -1

    watch(bookmarks, async (to) => {
      if (rowIndex > -1) {
        const bookmark = JSON.parse(JSON.stringify(to[rowIndex]))
        const res = await store.updateBookmark(bookmark)
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

    const handleBackBtnClicked = () => {
      router.push('/')
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
      } else if (val.length > 10) {
        errorName.value = true
        errorMessageName.value = 'Please use maximum 10 characters'
        return false
      }

      errorName.value = false
      errorMessageName.value = ''

      return true
    }

    const errorUrl = ref(false)
    const errorMessageUrl = ref('')
    const urlValidation = (val) => {
      if (val === undefined) {
        errorUrl.value = false
        errorMessageUrl.value = ''
        return false
      } else if (val.length === 0) {
        errorUrl.value = true
        errorMessageUrl.value = 'Url is required'
        return false
      } else if (val.length > 150) {
        errorUrl.value = true
        errorMessageUrl.value = 'Please use maximum 150 characters'
        return false
      }

      errorUrl.value = false
      errorMessageUrl.value = ''

      return true
    }

    const editingName = (item) => {
      rowIndex = item.rowIndex
    }

    const editingUrl = (item) => {
      rowIndex = item.rowIndex
    }

    const addBookmark = async () => {
      const res = await store.insertBookmark(JSON.parse(JSON.stringify(newBookmark.value)))
      card.value = false

      if (res.result) {
        quasar.notify({
          message: 'Add completed',
          type: 'positive',
          textColor: 'dark',
          position: 'bottom-right',
          progress: true,
          timeout: 2500,
        })
      } else {
        quasar.notify({
          message: 'Add failed',
          type: 'negative',
          textColor: 'dark',
          position: 'bottom-right',
          progress: true,
          timeout: 2500,
        })
      }
    }

    const deleteBookmark = (id) => {
      quasar.dialog({
        title: '<div class="text-orange">Delete Bookmark</div>',
        message: 'Are you sure you want to delete this bookmark?',
        cancel: true,
        persistent: true,
        noShake: true,
        html: true,
      }).onOk(async () => {
        const res = await store.deleteBookmark(id)

        if (res.result) {
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
      errorName,
      errorMessageName,
      nameValidation,
      errorUrl,
      errorMessageUrl,
      urlValidation,
      editingName,
      editingUrl,
      addBookmark,
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