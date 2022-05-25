<template>
  <section :style="{'background-color': `${bg}`}" class="main-header">
    <router-link to="/board"><button class="btn-boards" title="Boards"><img src="../assets/boards.png" alt=""></button></router-link>
    <router-link to="/"><button title="Mello" class="btn-logo" ><img src="../assets/logo.gif" alt=""></button></router-link>
    <!-- <button class="btn-opt work" title="Workspaces">Workspaces <img class="img-arrow" src="../assets/arrow.png" alt=""></button> -->
    <button class="btn-opt" title="Recent">Recent <img class="img-arrow" src="../assets/arrow.png" alt=""></button>
    <button @click="boardMenuOpen=!boardMenuOpen" class="btn-opt create" title="Create">Create</button>
    <board-add-menu  @closeMenu="boardMenuOpen=false" :menuOpen="boardMenuOpen"></board-add-menu>
  
  <!--div class="header-features"></!--div>
    <div @click.stop="isUserMenuOpen = true">
    <user-menu
          v-if="isUserMenuOpen"
          v-clickoutside="hideUserMenu"
          :user="user"
          @logout="logout"
          @close="isUserMenuOpen = false"
        /-->
    <!--board-list
      v-if="isBoardListOpen"
      @closeBoardList="isBoardListOpen = false"
      @setBackground="setBackground"
      :boards="boards"
    /-->
    <!-- <div>
      <div class="btn-container" @click="goToBoardsPage">
        <span class="material-icons-outlined"></span>
        <span>Boards</span>
      </div>
    </div> -->
    <!-- <div class="btn-container" @click="goToHomePage">
        
        <board-compose
        @closeCompose="toggleBoardCompose"
        @addBoard="addBoard"
        v-if="isBoardComposeOn"
        ></board-compose>
      </div>
    </div> -->
        <user-avatar :diameter="32" :user="user"/>
  </section>
</template>

<script>
import userAvatar from "../components/user-avatar.vue";
import boardCompose from "../components/board-compose.vue";
import boardList from "../components/board-list.vue";
import userMenu from "../components/user-menu.vue";
import boardAddMenu from "./board-add-menu.vue";
import BoardAddMenu from "./board-add-menu.vue";

export default {
  data() {
    return {
      // isBoardComposeOn: false,
      // isBoardListOpen: false,

      // isUserMenuOpen: false,
      boardMenuOpen: false,
      user: null,
      bg: ''
    };
  },
  components: {
    userAvatar,
    boardCompose,
    boardList,
    userMenu,
    boardAddMenu,
    BoardAddMenu
},
  created() {
    this.user = this.$store.getters.loggedinUser
    // console.log(this.user);
  },
  methods: {
    toggleBoardCompose() {
      this.isBoardComposeOn = !this.isBoardComposeOn;
    },
    toggleBoardList() {
      this.isBoardListOpen = !this.isBoardListOpen;
    },
    hideBoardList() {
      this.isBoardListOpen = false;
    },
    hideUserMenu() {
      this.isUserMenuOpen = false;
    },
    addBoard(board) {
      this.$emit("addBoard", board);
      this.isBoardComposeOn = false;
    },
    setBackground(style) {
      this.$emit("setBackground", style);
    },
    async logout() {
      await this.$store.dispatch({ type: "logout" });
      const style = { "background-color": 'whitesmoke' };
      this.setBackground(style)
      this.$router.push("/");
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
    },
    getClr(){

    }
  },
  watch: {
    '$route.params'(p) {
      if (!p.boardId) 
        this.bg = '#026AA7'
        else this.bg = '#00000040'
      { immediate: true }
    },
  }
};
</script>
