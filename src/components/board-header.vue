<template>
  <div class="board-header">
    <div class="flex">
    <button class="btn-boards-drop"><img class="boards-icon" src="../assets/boardsIcon.png" alt=""><span> Boards </span><img class="img-arrow" src="../assets/arrow.png" alt=""></button>
    <h2 class="board-title" contenteditable="true">{{ board.title }}</h2>
    <button @click="starBoard" :class="checkStar" class="btn-star-board"><div></div></button> <span class="nav-divider">|</span>
    <button class="btn-user-space"><h4>{{ userWorkspace }} Workspace</h4></button> <span class="nav-divider sub">|</span>
    <div class="flex board-members">
      <user-avatar v-for="m in board.members" :key="m._id" :user="m"></user-avatar>
      <button class="btn-share-board flex center align-center"><span></span>Share</button>
    </div>
    <button class="btn-show-menu"><span></span><span> Show menu</span></button>
    </div>
    
  </div>
</template>

 <script>
import userAvatar from "../components/user-avatar.vue";
import showMenu from "../components/show-menu.vue";

export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      boardTitleToEdit: null,
      //isEditing: true,
      isMembersMenuOpen: false,
      isSideMenuOpen: false,
    };
  },
  computed: {
    selected() {
      return { selected: this.board.isStarred };
    },
    users() {
      return this.$store.getters.users;
    },
    boardTitle() {
      return JSON.parse(JSON.stringify(this.board.title));
    },
    userWorkspace(){
      const name = this.board.createdBy.fullname.split(' ')
      // const lName = this.board.createdBy.fullname.split(' ')
      // console.log(name[1].split());
      return name[0] +' ' +  name[1].split('')[0] + `'s`
    },
    checkStar(){
      if(this.board.star)
      return 'star-on'
    }
  },
  created() {
  },
  watch: {
    boardTitle: {
      immediate: true,
      handler() {
        this.boardTitleToEdit = this.boardTitle;
      },
    },
  },
  methods: {
    setBackground(style) {
      this.$emit("setBackground", style);
    },
    starBoard(){
      if(!this.board.star)
      this.$emit('starBoard', true)
      else
      this.$emit('starBoard', false)
    }
  },
  components: {
    userAvatar,
    showMenu,
  },
};
</script>