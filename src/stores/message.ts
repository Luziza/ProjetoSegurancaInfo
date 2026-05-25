import { defineStore } from 'pinia'
import { ref } from 'vue'
export type SnackbarTypes = 'info' | 'warning' | 'error'
type SnackbarItem = {
  text: string
  color: SnackbarTypes
}

export const useMessagesStore = defineStore('messages', () => {
  const queue = ref<SnackbarItem[]>([])

  function add(message: SnackbarItem) {
    queue.value.push(message)
  }

  return { queue, add }
})

