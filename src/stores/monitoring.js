import { defineStore } from 'pinia'

export const useMonitoringStore = defineStore('monitoring', {
  state: () => ({
    toggleControl: false,
    isDone: false,
    slideIndex: 0,
    bookmarks: [],
  }),

  getters: {
    getIsDone (state) {
      return state.isDone
    },
    getToggleControl (state) {
      return state.toggleControl
    },
    getSlideIndex (state) {
      return state.slideIndex
    },
  },

  actions: {
    setIsDone (isDone) {
      this.isDone = isDone
    },
    setToggleControl (toggleControl) {
      this.toggleControl = toggleControl
    },
    setSlideIndex (slideIndex) {
      this.slideIndex = slideIndex
    },
    async fetchBookmarks () {
      const res = await window.myWindowAPI.selectBookmarks()
      this.bookmarks = res.rows
    },
    async updateBookmark (bookmark) {
      return await window.myWindowAPI.updateBookmark(bookmark)
    },
    async insertBookmark (bookmark) {
      const res = await window.myWindowAPI.insertBookmark(bookmark)

      if (res.result) {
        this.fetchBookmarks()
      }

      return res
    },
    async deleteBookmark (id) {
      const res = await window.myWindowAPI.deleteBookmark(id)

      if (res.result) {
        this.fetchBookmarks()
      }

      return res
    },
  }
})
