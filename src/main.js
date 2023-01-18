import { createApp } from 'vue'
import App from './App.vue'
import { createStore } from 'vuex'

import './assets/main.css'
import './registerServiceWorker'

const store = createStore({
  state() {
    return {
      editor: null,
      database: null,
      title: 'New Note',
      notes: [],
      activeNote: {},
      isOffline: !navigator.onLine
    }
  },
  mutations: {
    updateActiveNote(state, activeNote) {
      state.activeNote = activeNote
    },
    updateDatabase(state, database) {
      state.database = database
    },
    updateEditor(state, editor) {
      state.editor = editor
    },
    updateIsOffline(state, isOffline) {
      state.isOffline = isOffline
    },
    updateNotes(state, notes) {
      state.notes = notes
    }
  },
  actions: {
    addNewNote({ commit, state }) {
      const transaction = state.database.transaction("notes", "readwrite")

      const now = new Date()

      const note = {
        content: '',
        title: 'New Note',
        created: now.getTime(),
      }
      const notes = state.notes
      notes.unshift(note)
      commit('updateNotes', notes)

      commit('updateActiveNote', note)

      transaction.objectStore("notes").add(note)
    },
    destroyEditor({ commit, state }) {
      state.editor.destroy()
      commit('updateEditor', null)
    },
    init({ dispatch }) {
      dispatch('initDatabase').then(() => {
        dispatch('initNotes')
      })
    },
    initDatabase({ commit }) {
      const db = window.indexedDB.open("notes", 2)

      db.onerror = e => {
        console.log('db.onerror', e)
      }

      db.onsuccess = e => {
        console.log('db.onsuccess', e)
        commit('updateDatabase', e.target.result)
      }

      db.onupgradeneeded = e => {
        console.log('db.onupgradeneeded', e)
        if (e.oldVersion === 1) {
          e.target.result.deleteObjectStore("notes")
        }
        e.target.result.createObjectStore("notes", { keyPath: "created" })
      }

    },
    initNotes({ commit, state }) {
      state.database.transaction("notes")
          .objectStore("notes")
          .getAll()
          .onsuccess = e => {
            console.log('getNotes()', e.target.result)
            commit('updateNotes', e.target.result)
        }
    },
    saveNote({ commit, state }) {
      const noteStore = state.database.transaction("notes", "readwrite")
          .objectStore("notes")
        const noteRequest = noteStore.get(state.activeNote.created)

        noteRequest.onerror = e => {
          console.error('Error saving the note in the database')
        }

        noteRequest.onsuccess = e => {
          let note = e.target.result
          note.content = state.editor.getHTML()

          const updateRequest = noteStore.put(note)

          updateRequest.onerror = e => {
            console.error('Error storing the updated note in the database.')
          }

          updateRequest.onsuccess = e => {
            const notes = state.notes
            const noteIndex = notes.findIndex(n => n.created === note.created)
            notes[noteIndex] = note
            commit('updateNotes', notes)
          }
        }
    }
  }
})

const app = createApp(App)
app.use(store)
app.mount('#app')

store.dispatch('init')
