<template>
<section class="copy-group-menu">
<custom-menu  :menuOpen="menuOpen">
   <p>Copy list</p>
    <button @click="closeMenu" class="close" title="Close"></button>
   <hr>
   <form action="submit" @submit.prevent="saveGroup" >
   <div>Name</div>
   <textarea style="resize: none" v-model="titleForDisplay"></textarea>
   <button>Create list</button>
   </form>
</custom-menu>
  </section>
</template>

<script>

import customMenu from "./custom-menu.vue"

export default {
  props: {
    menuOpen:Boolean,
    groupTitle: String
  },
  data(){
    return {
        titleForDisplay: JSON.parse(JSON.stringify(this.groupTitle))
    }
  },
  components: {
    customMenu
  },
  mounted() {
  },
  methods: {
    addTask(){
      this.$emit('newTask')
    },
    saveGroup(){
      this.$emit('saveGroup', this.titleForDisplay)
    },
    closeMenu(){
      this.$emit('closeMenu')
    }
  },
 
}
</script>

<style>

</style>