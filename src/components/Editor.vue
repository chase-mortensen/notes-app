<template>
  <main
    class="flex flex-col grow bg-white dark:bg-gray-900"
  >
    <div
      v-if="isOffline"
      class="absolute top-0 left-0 opacity-75 z-10 w-full text-center py-2 bg-red-300 border-red-700 text-white"
    >Sorry, it looks like you're offline.</div>
    <!-- Notes Editor -->
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
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
  components: {
    EditorContent,
  },
  methods: {
    saveNote() {
      this.$store.dispatch('saveNote')
    }
  },
  computed: {
    editor() {
      return this.$store.state.editor
    },
    isOffline() {
      return this.$store.state.isOffline
    }
  },
  mounted() {
    const editor = new Editor({
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

    this.$store.commit('updateEditor', editor)
  },

}
</script>