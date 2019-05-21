/**
 *
 * @param {关键字} name
 * @param {值} content
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}
/**
 *
 * @param {localStorage 下标} name
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}
/**
 *
 * @param {localStorage 下标} name
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}
/**
 *sessionStorage
 * @param {key键} name
 * @param {value值} content
 */
export const setSessionStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}
/**
 *
 * @param {sessionStorage 下标} name
 */
export const getSessionStore = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}
/**
 *
 * @param {sessionStorage 下标} name
 */
export const removeSessionStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}
