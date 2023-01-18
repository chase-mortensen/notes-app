<template>
  <main
    class="flex flex-col grow bg-white dark:bg-gray-900"
  >
    <div
      v-if="isOffline"
      class="absolute top-0 left-0 opacity-75 z-10 w-full text-center py-2 bg-red-300 border-red-700 text-white"
    >Sorry, it looks like you're offline.</div>
    <!-- Notes List -->
    <div class="flex flex-col grow overflow-auto">
      <div
        v-for="note in notes"
        :key="note.created"
      >
        <div class="flex px-4 pt-3 pb-4">
          <div class="prose my-2 mx-auto">
            <div>
              <span class="ml-1 text-xs text-gray-500">Created on {{ new Date(note.created).toLocaleString() }}</span>
            </div>
            <div v-html="note.content"></div>
          </div>
        </div>
        <hr class="w-full">
      </div>
    </div>
  </main>
</template>

<script>
export default {
  computed: {
    notes() {
      return this.$store.state.notes
    },
    isOffline() {
      return this.$store.state.isOffline
    }
  }
}
</script>
