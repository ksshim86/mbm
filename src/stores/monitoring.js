import { defineStore } from 'pinia'

export const useMonitoringStore = defineStore('monitoring', {
  state: () => ({
    toggleControl: false,
    isDone: false,
    slideIndex: 0,
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
    }
  }
})
