import { defineStore } from 'pinia'

export const useMonitoringStore = defineStore('monitoring', {
  state: () => ({
    isDone: false
  }),

  getters: {
    getIsDone (state) {
      return state.isDone
    }
  },

  actions: {
    done () {
      this.isDone = true
    },
    edit () {
      this.isDone = false
    },
  }
})
