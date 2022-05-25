<template>
  <section>
    <main-header></main-header>
    <router-view></router-view>
  </section>
</template>

<script>
import mainHeader from './components/main-header.vue'
import { socketService } from "./services/socket.service";

export default {
  name: 'app-vue',
  // created() {
  //   window.addEventListener('click', (ev) => {
  //     const elMainEditModal = document.querySelector('.main-edit-modal')
  //     if (!elMainEditModal || !elMainEditModal.contains(ev.target)){
  //     }
  //     console.log(!elMainEditModal || !elMainEditModal.contains(ev.target))
  //   })
  // },
   /*async created() {
    try {
      socketService.setup();
      await this.$store.dispatch({ type: "loadUsers" });
      await this.$store.dispatch({ type: "loadBoards" });
    } catch (err) {
      console.log("ERROR cannot load users or boards");
    }
  },*/
  computed: {
    editModalStatus() {
      return this.$store.getters.editModalStatus
    }
  },
  components: {
    mainHeader
  },


}
</script>

<style>
</style>