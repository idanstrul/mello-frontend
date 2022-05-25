<template>
<section class="board-add-menu">
<custom-menu  :menuOpen="menuOpen">
   <p>Create board</p>
    <button @click="closeMenu" class="close" title="Close"></button>
   <hr>
   <section  class="board-add-container flex align-center column">
   <div :style="getBg" class="board-image-container flex center align-center"><img class="board-image" src="../assets/boardAdd.svg" alt=""></div>
   <div class="bg-selector">
   <p>Background</p>
   <div class="btn-bg-container flex wrap">
   <!-- <button > -->
   <label v-for="(bg, idx) in boardToAdd.style.bgImg" :key="idx" @click.stop="setBg(bg)" :idx="idx">
      <img v-if="bg.split('')[0] !== '#'" class="bg-opt" :src="bg" alt="" :ref="bg">
      <div :style="getStyle(bg)" class="bg-opt clr" v-if="bg.split('')[0] == '#'" :ref="bg"></div>
   </label>
   <!-- </button> -->
   <p>Board title <span>*</span></p>
    <form action="submit" @submit.prevent="">
   <input required ref="title" @focus="getClass" @input="getClass" placeholder="   " v-focus type="text">
   <!-- <a href=""></a> -->
   <div class="emoticon">👋 Board title is required</div>
   <button ref="btn" type="submit" @click="saveBoard">Create</button>
   </form>
   </div>
   </div> 
    
   </section>
   <!-- <form action="submit" @submit.prevent="saveGroup" > -->
   <!-- <div>Name</div> -->
   <!-- <textarea style="resize: none" v-model="titleForDisplay"></textarea> -->
   <!-- <button>Create list</button> -->
   <!-- </form> -->
</custom-menu>
  </section>
</template>

<script>

import customMenu from "./custom-menu.vue"
import { boardService } from "../services/board.service"

export default {
  props: {
    menuOpen:Boolean,
  },
  data(){
    return {
      boardToAdd: null,
      boardBg: '#0079bf'
    }
  },
  components: {
    customMenu
  },
  async created(){
    const board = await this.$store.dispatch({type: 'getEmptyBoard'})
    // const board = await boardService.getById(id)
    this.boardToAdd = board
    // console.log(this.boardToAdd);
  },
  mounted() {
    // console.log(this.$refs);
  },
  methods: {
    setBg(bg){
      // debugger
      this.boardBg=bg
      console.log(bg);
      console.log(this.$refs);
      for (const bg in this.$refs) {
        if(this.boardBg === bg){
          if(bg.split('')[0] === '#'){
            this.$refs[bg][0].classList.value = 'bg-opt clr checked'
          } else {
            this.$refs[bg][0].classList.value = 'bg-opt checked'
          }
        } else {
          if(bg.split('')[0] === '#'){
            this.$refs[bg][0].classList.value = 'bg-opt clr'
          } else {
            this.$refs[bg][0].classList.value = 'bg-opt'
          }
        }
        //   console.log(this.$refs[bg][0].classList);
        //   if(bg.split('')[0] === '#') 
        //   this.$refs[bg][0].classList.value = ['bg-opt', clr ,checked]
        //   else
        //   this.$refs[bg][0].classList.value = ['bg-opt', checked]
        // } else{
        //   if(bg.split('')[0] === '#') 
        //   this.$refs[bg][0].classList.value = ['bg-opt', clr]
        //   else{
        //     if(typeof this.$refs[bg] === Array)
        //     this.$refs[bg][0].classList.value = ['bg-opt']
        //   }
        // } 
      }
    },
    closeMenu(){
      this.$emit('closeMenu')
    },
    getStyle(bg){
      // console.log(bg);
    return `background-color: ${bg}`
      // if (this.boardBg === )
    },
    getClass(){
      // console.log(this.$refs);
      if(this.$refs.title.value) this.$refs.btn.classList.value = 'enable'
      else this.$refs.btn.classList.value = 'disable'
    },
    async saveBoard(){
      if(!this.$refs.title.value) return
      this.boardToAdd.title = this.$refs.title.value
      this.boardToAdd.style.bg = this.boardBg
      const user = this.$store.getters.loggedinUser
      this.boardToAdd.createdBy = {
        "_id": user._id,
        "fullname": user.fullname,
        "imgUrl": "http://some-img"
      }
      delete this.boardToAdd.style.bgImg
     const board = await this.$store.dispatch({type: 'saveCurrBoard', boardToSave: this.boardToAdd})
    //  this.$router.push('')
    this.boardToAdd = await this.$store.dispatch({type: "getEmptyBoard"})
      this.$router.push(`/board/${board._id}`);

    }
  },
  computed: {
    getBg(){
      if(this.boardBg){
        // console.log(this.boardBg);
        if(this.boardBg.split('')[0] === '#')
        return `background-color: ${this.boardBg}` 
        return `background-image: url(${this.boardBg})` 
      }
    },
  },
 
}
</script>

<style>

</style>