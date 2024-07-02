import { useAppStateStore } from '../stores/appState'

export default function toLocaleNumber (number, options, locales) {
  if (typeof locales !== 'string') {
    const appStateStore = useAppStateStore()
    locales = appStateStore.locales
  }

  return new Intl.NumberFormat(locales, options).format(number)
}
