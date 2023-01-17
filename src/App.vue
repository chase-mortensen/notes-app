<template>
  <div class="flex w-screen h-screen text-gray-700">
    <aside class="flex flex-col shrink-0 w-64 border-r border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
      <div class="h-0 overflow-auto flex-grow">
        <div class="mt-4">
          <a
            v-for="note in notes"
            :key="note.created"
            href="#"
            class="flex items-center h-8 text-sm pl-8 pr-3"
          >
            <span class="ml-2 leading-none"> {{ `${note.title} - ${new Date(note.created).toLocaleDateString()}` }}</span>
          </a>
        </div>
      </div>
    </aside>
    <main class="flex flex-col grow bg-white dark:bg-gray-900">
      <section class="flex flex-col grow overflow-auto">
        <editor-content :editor="editor" />
      </section>
      <div class="h-16 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 text-right flex flex-row-reverse">
        <button
          @click="saveNote"
          type="button"
          class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 my-auto mr-4">Save Note</button>
      </div>
    </main>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
  name: 'App',
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null,
      database: null,
      title: 'New Note',
      notes: []
    }
  },
  methods: {
    async getDatabase() {
      // await window.indexedDB.open("notes")
      return new Promise((resolve, reject) => {
        const db = window.indexedDB.open("notes", 1)

        db.onerror = e => {
          console.log('db.onerror', e)
          reject('Error opening the database.')
        }

        db.onsuccess = e => {
          console.log('db.onsuccess', e)
          resolve(e.target.result)
        }

        db.onupgradeneeded = e => {
          console.log('db.onupgradeneeded', e)
          e.target.result.deleteObjectStore("notes")
          e.target.result.createObjectStore("notes", { keyPath: "created" })
        }
      })
    },
    async getNotes() {
      return new Promise((resolve, reject) => {
        this.database.transaction("notes")
          .objectStore("notes")
          .getAll()
          .onsuccess = e => {
            console.log('getNotes()', e.target.result)
            resolve(e.target.result)
        }
      })
    },
    async saveNote() {
      return new Promise((resolve, reject) => {
        const transaction = this.database.transaction("notes", "readwrite")
        transaction.oncomplete = e => {
          resolve()
        }
        const now = new Date()

        const note = {
          content: this.editor.getHTML(),
          title: this.title,
          created: now.getTime(),
        }

        this.notes.unshift(note)

        transaction.objectStore("notes").add(note)
      })
    },
  },
  async created() {
    this.database = await this.getDatabase()
    const notes = await this.getNotes()
    this.notes = notes.reverse()
  },
  mounted() {
    this.editor = new Editor({
      content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit,
      ],
      editorProps: {
        attributes: {
          class: "prose my-6 mx-auto focus:outline-none"
        }
      }
    })
  },
  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style scoped>

</style>
