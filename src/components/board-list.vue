<template>
  <section >
    <header>
      <input
        ref="searchBoard"
        class="input-search-boards"
        type="text"
        placeholder="Find boards by name..."
        v-model="searchBoard"
        @input="setFilter"
      />
      <span @click="closeBoardList"
        >close</span
      >
    </header>
    <main>
      <section v-if="!searchBoard">
        <div v-if="borads.length">
          <h2 class="title">
            <span>BOARDS</span>
          </h2>
          <div v-if="!listClose.includes('borads')">
            <article
              v-for="board in borads"
              :key="board._id"
              class="board-preview"
              @click="openBoard(board)"
            >
              >
            </article>
          </div>
        </div>

        <div>
          <h2>
            <span>RECENT BOARDS</span>
          </h2>
          
          <div v-if="!listClose.includes('recentBoards')">
            <article
              v-for="board in recentBoards"
              :key="board._id"
              @click="openBoard(board)"
            >
            </article>
          </div>
        </div>

        <div>
          <h2>
            <span>ALL BOARDS</span>
          </h2>
          <div v-if="!listClose.includes('boards')">
            <article
              v-for="board in boards"
              :key="board._id"
              class="board-preview"
              @click="openBoard(board)"
            >
            </article>
          </div>
        </div>
      </section>
      <section  v-else>
        <div>
          <article
            v-for="board in boardsAfterFilter"
            :key="board._id"
            class="board-preview"
            @click="openBoard(board)"
          >
          </article>
        </div>
      </section>
    </main>
  </section>
</template>

<script>
export default {
  props: {
    boards: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      recentBoards: null,
      listClose: [],
      searchBoard: "",
    };
  },
  created(){
     if(this.$store.getters.currBoard){
         this.$store.commit({ type: "addBoardToRecentBoards", board:(this.$store.getters.currBoard) });
     }
         this.recentBoards = this.$store.getters.recentBoards;
  },
  mounted() {
    this.$refs.searchBoard.focus();
  },
  methods: {
    closeBoardList() {
      this.$emit("closeBoardList");
    },
    openBoard(board) {
      this.$store.commit({ type: "addBoardToRecentBoards", board });
         if (!this.$store.getters.currBoard ||
          board._id !== this.$store.getters.currBoard._id) {
         this.$emit("setBackground", board.style);
         this.$store.commit({ type: "setCurrBoard", board });
         this.$router.push(`/b/${board._id}`);
         }
      this.closeBoardList();
    },
    toggleListClose(listName) {
      const listIdx = this.listClose.findIndex((list) => list === listName);
      if (listIdx === -1) {
        this.listClose.push(listName);
      } else {
        this.listClose.splice(listIdx, 1);
      }
    },
    setFilter() {
      this.$store.commit({
        type: "setFilterBy",
        filterBy: { txt: this.searchBoard },
      });
    },
  },
  computed: {
    borads() {
      return this.boards.filter((board) => board.isStarred);
    },
    boardsAfterFilter() {
      return this.$store.getters.boardsToShow;
    },
  },
};
</script>
