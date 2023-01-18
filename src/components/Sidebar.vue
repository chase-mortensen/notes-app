<template>
  <aside class="flex flex-col shrink-0 w-64 border-r border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
    <div class="h-0 overflow-auto flex-grow">
      <div class="flex items-center h-8 px-3 group mt-4">
        <div class="flex items-center flex-grow focus:outline-none">
          <a
            href="#"
            @click.prevent="showAllNotes"
            class="ml-2 leading-none font-medium text-sm"
          >
            All Notes
          </a>
        </div>
        <button
          type="button"
          @click="addNewNote"
          class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <PlusIconMini class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-4">
        <a
          v-for="note in notes"
          :key="note.created"
          href="#"
          @click.prevent="openNote(note)"
          class="flex items-center h-8 text-sm pl-8 pr-3"
        >
          <span class="ml-2 leading-none"> {{ `${note.title} - ${new Date(note.created).toLocaleDateString()}` }}</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { PlusIcon as PlusIconMini } from '@heroicons/vue/20/solid'
</script>

<script>
export default {
  methods: {
    addNewNote() {
      this.$store.dispatch('addNewNote')
    },
    openNote(note) {
      this.$store.commit('updateActiveNote', note)
      this.$store.state.editor.commands.setContent(note.content)
    },
    showAllNotes() {
      this.$store.state.editor.commands.clearContent()
      this.$store.commit('updateActiveNote', {})
    },
  },
  computed: {
    notes() {
      return this.$store.state.notes
    }
  }
}
</script>