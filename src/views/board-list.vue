<template>
  <section class="board-list flex center column align-center">
    <section>
    <h3>STARRED BOARDS</h3>
    <div class="board-list-container flex wrap center">
      <label @click="$router.push(`/board/${b._id}`)" v-for="b in starBoards" :key="b._id" >
        <span class="board-title">
        {{b.title}}
        </span>
        <span @click.stop="starBoard(b._id)" :class="checkStar(b)" class="board-star"></span>
        <img v-if="b.style.bg.split('')[0]!=='#'" :src="b.style.bg" alt="">
        <div :style="{'background-color': `${b.style.bg}` }" v-else></div>
        </label>
    </div>
    </section>

    <section>
    <h3 class="boards">YOUR BOARDS</h3>
    <div class="board-list-container flex wrap center">
      <label @click="$router.push(`/board/${b._id}`)" v-for="b in boards" :key="b._id" >
        <span class="board-title">
        {{b.title}}
        </span>
        <span @click.stop="starBoard(b._id)" :class="checkStar(b)" class="board-star"></span>
        <img v-if="b.style.bg.split('')[0]!=='#'" :src="b.style.bg" alt="">
        <div :style="{'background-color': `${b.style.bg}` }" v-else></div>
        </label>
    </div>
    </section>
    
  </section>
</template>

<script>
export default {
  data(){
    return {
      // boards: null

    }
  },
  async mounted(){
   const res = await this.$store.dispatch({type: 'loadBoards'})
    console.log(this.boards);
  },
  computed: {
    boards(){
     return this.$store.getters.boards
    },
    starBoards(){
      return this.$store.getters.starBoards
    },
  },
  methods: {
    checkStar(b){
     if(b.star)
     return 'star-on'
   },
    async starBoard(boardId){
      const boards = this.$store.getters.boards
      const idx = boards.findIndex(b => b._id === boardId)
      if(!boards[idx].star)
      boards[idx].star = true
      else boards[idx].star = false
      await this.$store.dispatch({type: 'saveCurrBoard', boardToSave: boards[idx]})
      await this.$store.dispatch({type: 'loadBoards'})
    }
  },
}
</script>

<style>

</style>