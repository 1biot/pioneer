import toLocaleNumber from './toLocaleNumber'

const defaultFormatOptions = {
  style: 'unit',
  unit: 'byte'
}

export default function formatBytes (bytes, decimals = 2) {
  if (!+bytes) return toLocaleNumber(0, defaultFormatOptions)
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizesLocales = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const parsedFloat = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  return `${toLocaleNumber(parsedFloat, { ...defaultFormatOptions, ...{ unit: sizesLocales[i] } })}`
}
