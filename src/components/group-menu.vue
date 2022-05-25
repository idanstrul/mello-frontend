<template>
<section class="group-menu">
<custom-menu  :menuOpen="menuOpen">
   <p>List actions</p>
   <button @click="closeMenu" class="close" title="Close"></button>
   <hr>
   <p @click="addTask">Add card...</p>
   <p @click="copyGroup">Copy list...</p>
   <hr>
   <p @click="removeGroup">Remove this list...</p>
</custom-menu>

  </section>
</template>

<script>

import customMenu from "./custom-menu.vue"

export default {
  props: {
    menuOpen:Boolean,
  },
  data(){
    return {
    }
  },
  components: {
    customMenu,
    
  },
  methods: {
    addTask(){
      this.$emit('newTask')
      // this.menuOpen = false
      // console.log('adding');
    },
    copyGroup(){
      this.$emit('copyGroup')
    },
    removeGroup(){
      // console.log('hi');
      this.$emit('removeGroup')
    },
    closeMenu(){
      this.$emit('closeMenu')
    }
  }
}
</script>

<style>

</style>