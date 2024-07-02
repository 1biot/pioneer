import toLocaleNumber from './toLocaleNumber'

export default function elapsedTime (seconds) {
  const weeks = Math.floor(seconds / (7 * 24 * 60 * 60))
  seconds -= weeks * (7 * 24 * 60 * 60)
  const days = Math.floor(seconds / (24 * 60 * 60))
  seconds -= days * (24 * 60 * 60)
  const hours = Math.floor(seconds / (60 * 60))
  seconds -= hours * (60 * 60)
  const minutes = Math.floor(seconds / (60))
  seconds -= minutes * (60)

  let returnString = ''
  if (weeks) returnString += `${translateToLocale('week', weeks, days || hours || minutes || seconds)}`
  if (days) returnString += `${translateToLocale('day', days, hours || minutes || seconds)}`
  if (hours) returnString += `${translateToLocale('hour', hours, minutes || seconds)}`
  if (minutes) returnString += `${translateToLocale('minute', minutes, !!seconds)}`
  if (seconds) returnString += `${translateToLocale('second', seconds)}`
  return returnString
}

function translateToLocale (unit, number, showDelimiter = false) {
  return `${toLocaleNumber(number, { style: 'unit', unit, unitDisplay: 'short' })}${showDelimiter ? ', ' : ''}`
}
