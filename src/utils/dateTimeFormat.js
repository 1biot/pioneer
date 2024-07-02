import { useAppStateStore } from '../stores/appState'

export default function dateTimeFormat (date, options, locales) {
  if (typeof options === 'undefined' || options === 'long') {
    options = {
      dateStyle: 'full',
      timeStyle: 'long'
    }
  } else if (options === 'medium') {
    options = {
      dateStyle: 'long',
      timeStyle: 'medium'
    }
  } else if (options === 'short') {
    options = {
      dateStyle: 'medium',
      timeStyle: 'short'
    }
  }

  if (typeof locales !== 'string') {
    const appStateStore = useAppStateStore()
    locales = appStateStore.locales
  }

  return new Intl.DateTimeFormat(locales, options).format(date)
}
