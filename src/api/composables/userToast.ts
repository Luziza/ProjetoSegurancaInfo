import { useMessagesStore, type SnackbarTypes } from "@/stores/message"


export default function useToast() {
  const store = useMessagesStore()

  function show(text: string, type: SnackbarTypes) {
    store.add({
      text,
      color: type,
    })
  }

  return { show }
}

