<template>
  <section class="boards-page">
    <div class="container">
    <h1 class="title">Choose Your Board</h1>
      <ul>
        <li v-for="board in boards" :key="board._id">
          <section
            @click="openBoard(board._id)"
          >
          </section>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>

export default {
  async created() {
    if (!this.boards) {
      try {
        await this.$store.dispatch({ type: "loadBoards" });
      } catch (err) {
        console.log("ERROR cannot load boards");
      }
    }
  },
  methods: {
    openBoard(boardId) {
      this.$router.push(`/board/${boardId}`);
    },
    closeAddBoard() {
      this.isAddBoard = false;
    },
    },
  computed: {
    boards() {
      return this.$store.getters.boards;
    },
  },
};
</script>
