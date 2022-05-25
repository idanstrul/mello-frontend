<template>
<section>
  
  <div v-if="isAddingGroup" @click="addGroup" class="group-add">
      <div class="flex align-center">
          <span></span>
          <span>Add another list</span>
     </div>
  </div>
  <!-- <Transition enter-active-class="animate__animated animate__fadeIn animate__faster"
    leave-active-class="animate__animated animate__fadeOut animate__faster"> -->
  <div v-if="!isAddingGroup" class="group-edit">
      <form type="submit" @submit.prevent="saveGroup">
        <input type="text"
               ref="title"
               placeholder="Enter list title..."
               v-model="groupToAdd.title"
        >
        <div>
        <button>Add list</button>
        <button @click="closeGroupAdd"></button>
        </div>
          <!-- <span>+</span>
          <span>Add another list</span> -->
     </form>
  </div>
  <!-- </Transition> -->
</section>
</template>

<script>

import { boardService } from '../services/board.service'

export default {
  props: {
    isAddingGroup: Boolean
  },
  data(){
    return {
      groupToAdd: boardService.getEmptyGroup()
    }
  },
  methods: {
    addGroup(){
      this.$emit('addGroup')
      this.$nextTick(() => {
        this.$refs.title.focus()
      })
    },
    saveGroup(){
      this.groupToAdd.title = this.groupToAdd.title.trim()
      console.log('group>>',this.groupToAdd);
      if(!this.groupToAdd.title) return
      this.$emit('saveGroup', this.groupToAdd)
      this.groupToAdd = boardService.getEmptyGroup()
    },
    closeGroupAdd(){
      this.groupToAdd = boardService.getEmptyGroup()
      this.$emit('closeGroupAdd')
    }
  }
}
</script>

<style>

</style>