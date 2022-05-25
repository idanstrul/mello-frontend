<template>
  <div class="custom-menu">
    <div>
      <Transition enter-active-class="animate__animated animate__slideInRight"
      leave-active-class="animate__animated animate__slideOutLeft">
        <div v-if="menuOpen" class="custom-menu-container">
             <span class="btn-boards-drop">Change background</span>
             <li
            v-for="color in colors"
            :key="color"
            :style="{ backgroundColor: color }"
            class="color"
            @click="changeBackground(color, '')"
          ></li>
        </div>
      </Transition>
    </div>
   </div>
</template>

<script>
export default {
    props: {
    menuOpen:Boolean,
    },
  data(){
    return {
    }
  },
  computed: {
    background() {
       (this.board.style["background-color"])
        return { "background-color": this.board.style["background-color"] };
    },
  methods: {
      close() {
      this.$emit("close");
    },
    
changeBackground(color) {
      const style = {
        "background-color": color,
      };
      this.$emit("setBackground", style);
    },
  }
}
}
</script>

