<template>
  <section class="user-menu">
    <div class="group-edit-header">
      <span>Account</span>
      <span @click.stop="close" class="close">X</span>
    </div>
      <div class="account-info">
       <user-avatar
          :size="32"
          :username="user.fullname"
          :src="user.imgUrl"
          backgroundColor="#DFE1E6"
          color="#172b4d"
       />
        <div class="account-details">
          <span>{{ user.fullname }}</span>
          <span class="username"> ( {{ user.username }} )</span>
        </div>
      </div>
      <div class="logout" @click="logout">Log out</div>
  </section>
</template>

<script>
import userAvatar from "../components/user-avatar.vue";

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    logout() {
      this.$emit("logout");
    },
  },
  components: {
    userAvatar,
  },
};
</script>