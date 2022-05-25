<template>
  <div class="login-signup">
     <section class="header-home">
      <div class="logo">
          <span class="material-icons-outlined logo-icon"></span>Mello
      </div>
      <nav class="homepage-nav">
         <router-link to='/' class="login">Home</router-link>
         <span> | </span>
         <router-link to='/login' class="signup">Log in</router-link>
      </nav>
    </section>
    <div class="main-container">
        <p>Sign up for your account</p>
        <form @submit.prevent="signup">
            <input type="text" name="fullname" v-model="user.fullname" placeholder="Enter full name" autocomplete="off" required />
            <input type="text" name="username" v-model="user.username" placeholder="Enter username" autocomplete="off" required />
            <input type="email" name="email" v-model="user.email"  placeholder="Enter email" required />
            <input type="password" name="password" v-model="user.password" placeholder="Enter password" required />
            <div>
              <div v-if="isLoading">
                Loading image...
              </div>
            </div>
            <button >Sign up</button>
        </form>
        <router-link class="btn-signup" to="/login">Already have an account? Log in</router-link>
    </div>
  </div>
</template>

<script>


export default {
  data(){
    return {
      user: {
        fullname: null,
        username: null,
        email: null,
        password: null,
        imgUrl: '',
        mentions: []
      },
      isLoading: false,
      isLoaded: false
    }
  },
  methods: {
    async onUploadImg(ev) {
      try {
        this.isLoading = true;
        const res = await uploadImg(ev);
        this.user.imgUrl = res.url
        this.isLoaded = true
      } catch (err) {
        console.log("cannot upload image", err);
        throw err;_
      } finally {
        this.isLoading = false;
      }
    },
    async signup() {
      await this.$store.dispatch({ type: "signup", userCred: this.user });
      this.$router.push('/board/624afa5e47cdb81018c1bc99');
      //add(this.user);
      //this.$router.push(`/b/${this.$store.getters.boards[0]._id}`);
    },
  },
};
</script>