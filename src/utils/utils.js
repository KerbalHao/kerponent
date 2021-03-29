/*
 * @Date: 2021-03-29 10:19:12
 * @LastEditors: KerbalHao
 * @FilePath: \components\src\utils\utils.js
 */
export let debounce = function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    let ctx = this;
    if (timer) {
      clearTimeout(timer);
      timer = null
    } else {
      timer = setTimeout(() => {
        fn.apply(ctx, [...args]);
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}
