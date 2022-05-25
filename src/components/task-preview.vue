<template>
<!-- <Container> -->
  <Draggable>
<section class="task-preview">
  <button @click.stop="removeTask" title="Remove card" class="btn-remove-task"></button>
  <section v-if="task.style && task.style.size==='small'" class="small-cover">
          <img v-if="task.style && task.style.bg.split('')[0] !== '#'" :src="task.style.bg" alt="">
          <div :style="getCoverClr" class="cover-clr" v-else></div>
  </section>
  <section v-if="task.style && task.style.size==='big'" class="big-cover">
          <div class="big-cover-img" v-if="task.style && task.style.bg.split('')[0] !== '#'" :style="{'background-image': `url(${task.style.bg})`}">
            <div class="img-txt">
            <div></div>
            <div>
              <span>
                {{ task.title }}
              </span>
            </div>
            </div>
          </div>
          <div v-if="task.style && task.style.bg.split('')[0] === '#'" class="big-cover-clr" :style="{'background-color': `${task.style.bg}`}">
            <div>
              <span>{{ task.title }}</span>
            </div>
          </div>
          <!-- <img v-if="task.style && task.style.bg.split('')[0] !== '#'" :src="task.style.bg" alt=""> -->
          <!-- <div :style="getCoverClr" class="cover-clr" v-else></div> -->
  </section>
  <section v-if="!task.style || task.style.size==='small'">
  <section v-if="task.labelIds" class="task-labels">
    <span @click.stop="toggleLabels" @mouseover="hover=true" @mouseleave="hover=false" v-for="l in task.labelIds" :key="l" class="task-preview-label" :class="getClass" :style="getStyle(l)"><span>{{ getLabelText(l) }}</span></span>
  </section>
<p>{{ task.title }}</p>
<section v-if="checkBadges" class="task-preview-badges flex wrap">
<section v-if="task.startDate || task.dueDate" class="task-preview-date">
  <div  class="start-only" v-if="task.startDate && !task.dueDate">
    <span></span>
    <span>Starts: {{ startDate }}</span>
  </div>
  <div :class="getDateClass" @click.stop="toggleDate" @mouseover="toggleDateBg(-30); dateClass='unCheck'" @mouseleave="toggleDateBg(30); dateClass='clock'" :style="getDateBg" class="due-only " v-if="!task.startDate && task.dueDate">
    <span :class="dateClass"></span>
    <span>{{ dueDate }}</span>
  </div>
  <div :class="getDateClass" @click.stop="toggleDate" @mouseover="toggleDateBg(-30); dateClass='unCheck'" @mouseleave="toggleDateBg(30); dateClass='clock'" :style="getDateBg" class="due-only " v-if="task.startDate && task.dueDate">
    <span :class="dateClass"></span>
    <span>{{ startDate }}</span>
    <span>-</span>
    <span>{{ dueDate }}</span>
  </div>
</section>
<!-- <div class=""> -->
<section :style="getWidth" v-if="task.members" class="task-members flex">
  <user-avatar v-for="m in task.members" :key="m._id" :user="m"></user-avatar>
</section>
<!-- </div> -->
</section>
</section>

</section>
</Draggable>
<!-- </Container> -->
</template>

<script>

import userAvatar from "./user-avatar.vue"
import { Container, Draggable } from "vue3-smooth-dnd";
import { utilService } from "../services/util.service";
import format from 'date-fns/format'
import { tr } from 'date-fns/locale';

export default {
  name: 'task-preview',
  props: {
    task: Object,
    labelsOpen: Boolean,
  },
  components: {
    userAvatar,
    Container, 
    Draggable
  },
  data(){
    return {
      hover: false,
      open: true,
      dateBg: '',
      dateClass: `clock`
    }
  },
  mounted(){
    this.loadDate()
  },
  methods: {
    async updateTask(){
      const taskToSave = JSON.parse(JSON.stringify(this.task))
      this.$emit('saveTask', taskToSave)
      // const task =  await this.$store.dispatch({type: 'updateTask', taskToSave: this.task, groupIdx: this.groupIdx})
    this.$emit('socketUpdateBoard')
    },
    removeTask(){
      this.$emit('removeTask', this.task)
      this.$emit('socketUpdateBoard')
    },
    toggleDateBg(diff){
      this.dateBg = utilService.lightenDarkenColor(this.dateBg, diff)
    },
    getStyle(labelId){
      const boardLabels = this.$store.getters.currBoardLabels
      const label = boardLabels.find(label => label.id === labelId)
      // console.log(label);
      if(!label) return
      if(this.hover)
      return `background-color: ${utilService.lightenDarkenColor(label?.color, -30)}`
      return `background-color: ${label?.color}`
    },
    getLabelText(labelId){
      const boardLabels = this.$store.getters.currBoardLabels
      const label = boardLabels.find(label => label.id === labelId)
      // console.log(label);
      if(!label) return 
      return `${label.title}`
    },
    toggleLabels(){
      this.$emit('openLabels')
      this.open = !this.open
    },
    toggleDate(){
        if(this.task.status === 'over-due' || this.task.status === 'in-progress' || this.task.status === 'due-soon'){
          this.$emit('done')
          this.updateTask()
          return
        }
        if (this.task.dueDate - Date.now() < 0){
          this.$emit('over-due')
          this.updateTask()
          // this.$emit('done')
          // this.task.status = 'over-due'
          return
        } 
        if (this.task.dueDate - Date.now() > 86400 * 1000){
          this.$emit('in-progress')
          this.updateTask()
          // console.log('hi');
          // this.task.status = 'in-progress'
          return
        } 
      if (this.task.dueDate - Date.now() < (86400 * 1000) ) {
        this.$emit('due-soon')
        this.updateTask()
        // console.log(this.task.dueDate - Date.now());
        // this.task.status = 'due-soon'
        return
      }
    },
    loadDate(){
      // console.log(this.task.dueDate - Date.now() < 86400 * 1000);
      if (this.task.status === 'done') return
        if (this.task.dueDate - Date.now() < 0){
          this.task.status = 'over-due'
          return
        } 
        if (this.task.dueDate - Date.now() > 86400 * 1000){
          // console.log('hi');
          this.task.status = 'in-progress'
          return
        } 
      if (this.task.dueDate - Date.now() < 86400 * 1000) {
        // console.log(this.task.title);
        this.task.status = 'due-soon'
        return
      }
    },
    socketUpdateBoard() {
      this.$emit("socketUpdateBoard");
    },
  },
  computed: {
    checkStyle(){
      if(this.task.style){
        if(this.task.style.size === 'big')
        return `border-bottom: none`
        }
    },
    getCoverClr(){
      return `background-color: ${this.task.style.bg} !important`
    },
    checkBadges(){
      if(!this.task.members && !this.task.startDate && !this.task.dueDate) return false
      return true
    },
    getClass(){
      return this.labelsOpen ? 'open' : 'close'
    },
    getDateClass(){
      return this.task.status
    },
    startDate(){
      return format(this.task.startDate, 'MMM d')
    },
    dueDate(){
      return format(this.task.dueDate, 'MMM d')
    },
    getWidth(){
      var badgeCount = 0
      if(this.task.startDate || this.task.dueDate) badgeCount++
      if(this.task.comments) badgeCount++
      if (badgeCount > 2 || badgeCount === 0){
        return 'width: 100%'
      }
    },
    getDateBg(){
      if (this.task.startDate && !this.task.dueDate)
      return
    },
  },
    watch: {
      task(n, o){
        this.loadDate()
      }
    }
}
</script>
