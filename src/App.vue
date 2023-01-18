<template>
  <div class="flex w-screen h-screen text-gray-700">
    <sidebar></sidebar>
    <editor
      v-if="Object.keys(activeNote).length"
    ></editor>
    <notes v-else></notes>

  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Editor from './components/Editor.vue'
import Notes from './components/Notes.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    Editor,
    Notes
  },
  methods: {
    syncUserData() {
      if (this.isOffline) {
        return
      }
      // api request
    }
  },
  computed: {
    activeNote() {
      return this.$store.state.activeNote
    },
    isOffline() {
      return this.$store.state.isOffline
    }
  },
  mounted() {
    window.addEventListener('offline', () => {
      this.$store.commit('updateIsOffline', true)
    })

    window.addEventListener('online', () => {
      this.$store.commit('updateIsOffline', false)

      this.syncUserData()
    })
  },
  beforeUnmount() {
    this.$store.state.dispatch('destroyEditor')
  },
}
</script>

<style scoped>

</style>
