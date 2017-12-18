export const hastingsToSC = hastings => numberWithCommas(hastings / 1e24) + ' SC'
export const numberWithCommas = x =>
  x
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
