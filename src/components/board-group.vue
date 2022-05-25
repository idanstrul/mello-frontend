<template>
       <!-- <Container
        orientation="vertical"
        group-name="col-items"
        :shouldAcceptDrop="(e, payload) =>  (e.groupName === 'col-items')"
        :get-child-payload="getCardPayload(group.id)"
        @drop="(e) => onCardDrop(group.id, e)"> -->
  <!-- <Draggable> -->
 <section class="board-group">
   <div class="group-header ">
     <input type="text"
            @mousedown="delay"
            v-model="group.title"
            class="group-title"
            @blur="updateGroup"
     >
     <button @click="toggleMenu" class="btn-group-menu" title="Menu"></button>
     <group-menu @removeGroup="$emit('removeGroup',group)" @copyGroup="menuOpen=false;  subMenuOpen=true" @closeMenu="menuOpen=false" @newTask="addTask('taskToEdit')" :menuOpen="menuOpen"></group-menu>
    <copy-group-menu @saveGroup="saveGroup" @closeMenu="subMenuOpen=false" :menuOpen="subMenuOpen" :groupTitle="group.title"></copy-group-menu>
     </div>
     <task-add v-if="taskToEdit" :task="taskToEdit" @saveTask="saveTask"></task-add>
     <div class="tasks-container">
       <slot></slot>
       <!-- <Container>
    <task-preview v-for="task in group.tasks" :key="task.id" :task="task"></task-preview>
    </Container> -->
    </div>
    <div v-if="!subTaskToEdit" @click="addTask('subTaskToEdit')" class="flex align-center btn-task-add">
          <span></span>
          <span>Add a card</span>
     </div>
     <div class="sub-task-add">
     <task-add v-if="subTaskToEdit" :task="subTaskToEdit" @saveTask="saveTask"></task-add>
     </div>
 </section>
 <!-- </Draggable> -->
    <!-- </Container> -->
</template>

<script>

import taskPreview from "./task-preview.vue"
import groupMenu from "./group-menu.vue"
import copyGroupMenu from "./copy-group-menu.vue"
import taskAdd from "./task-add.vue"
import { utilService } from "../services/util.service"
import { boardService } from '../services/board.service'
import { Container, Draggable } from "vue3-smooth-dnd";
import TaskAdd from "./task-add.vue"


export default {
  props: {
    group:{
        type: Object,
        required: true
    },
    
  },
  data() {
    return {
      taskToEdit: null,
      menuOpen: false,
      subMenuOpen: false,
      subTaskToEdit: null,
    }
  },
  components: {
    taskPreview,
    groupMenu,
    taskAdd,
    copyGroupMenu,
    Container,
    Draggable,
    TaskAdd
},
  methods: {
    async delay(){
      // await
      setTimeout(() => {
        
      }, 3000);
    },
    closeMenu(){
      this.menuOpen = false
      this.subMenuOpen = false
    },
    toggleMenu(){
      
      this.menuOpen = !this.menuOpen
      if(this.subMenuOpen) {
        this.subMenuOpen = !this.subMenuOpen
        this.menuOpen = false
      }
    },
    updateGroup(){
        this.$emit('updateGroup', this.group)
    },
    addTask(task){
      
      this[task] = boardService.getEmptyTask()
      this.menuOpen = false
    //  console.log(this.taskToEdit);
  
    },
    saveTask(taskToSave){
      if(taskToSave.title){
        this.group.tasks.push(taskToSave)
        this.updateGroup()
      }
      this.taskToEdit = null
      this.subTaskToEdit = null
    },
    saveGroup(title){
      const groupToCopy = JSON.parse(JSON.stringify(this.group))
      groupToCopy.title = title
      groupToCopy.id = ''
      // console.log(groupToCopy);
      groupToCopy.tasks.forEach(task => {
        task.id = utilService.makeId()
      })
        // console.log(groupToCopy);
      this.menuOpen = false
      this.subMenuOpen = false
      this.$emit('saveGroup', groupToCopy)
    },
    getCardPayload (groupId) {
      return index => {
        return this.board.groups.filter(p => p.id === groupId)[0].tasks[index]
      }
    },
    onCardDrop (groupId, dropResult) {
      console.log(dropResult);
      // check if element where ADDED or REMOVED in current collumn
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        
        const scene = Object.assign({}, this.board)
        const column = scene.groups.filter(p => p.id === groupId)[0]
        const itemIndex = scene.groups.indexOf(column)
        const newColumn = Object.assign({}, column)
        
        // check if element was ADDED in current column
        if((dropResult.removedIndex == null && dropResult.addedIndex >= 0)){
          // your action / api call
          // dropResult.payload.loading = true
          // simulate api call
          // setTimeout(function(){ dropResult.payload.loading = false }, (Math.random() * 5000) + 1000); 
        }
        
        newColumn.tasks = utilService.applyDrag(newColumn.tasks, dropResult)
        scene.groups.splice(itemIndex, 1, newColumn)
        this.$emit('move', scene)
        // this.board = scene
      }
    }
  },
  computed: {
    
  }
}
</script>
