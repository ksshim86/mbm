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
    setIsDone (isDone) {
      this.isDone = isDone
    },
  }
})
