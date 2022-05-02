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

      if (res.result) {
        if (res.rows !== undefined && res.rows.length > 0) {
          this.bookmarks = []
          
          res.rows.forEach(row => {
            const obj = {}
            obj.label = row.NAME
            obj.value = row.URL
            this.bookmarks.push(obj)
          });
        }
      }
    },
  }
})
