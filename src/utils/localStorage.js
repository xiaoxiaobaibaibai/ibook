import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function setLocalStorage(key, value) {
    return localStorage.set(key, value)
}

export function getLocalStorage(key, value) {
    return localStorage.get(key)
}

export function removeLocalStorage(key) {
    return localStorage.delete(key)
}

export function clearLocalStorage() {
    return localStorage.clear()
}

export function setBookObject(fileName, key, value) {
    let book = getLocalStorage(`${fileName}-info`)
    if (!book) {
        book = {}
    }
    book[key] = value
    setLocalStorage(`${fileName}-info`, book)
}

export function getLocalStorage(fileName, key) {
    let book = getLocalStorage(`${fileName}-info`)
    if (book) {
        return book[key]
    }else {
        return null
    }
}