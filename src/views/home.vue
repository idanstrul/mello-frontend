<template>
<section class="homepage">
      <nav class="homepage-nav flex">
         <router-link title="Boards" to='/board' class="logo"><img src="../assets/homeLogo.png" alt=""></router-link>
        <div>

         <router-link title="Login" to='/login' class="login">Log in</router-link>
         <router-link title="Signup" to='/signup' class="signup">Sign up</router-link>
        </div>
      </nav>
      <main class="flex center">
        <img class="hero" src="../assets/Asset3.png" alt="">
        <div class="text">
        <h1>Mello helps teams move work forward.</h1>
        <p>As your software team grows, Mello makes it easy to manage workflows across multiple teams and projects. Simple, intuitive, fast: Mello is where software teams do their best work.
         Free to get started, with easy user experience Mello.</p>
        <router-link to='/board/624b2ee347cdb81018c1bc9a' class="btn-start">Start as a guest</router-link>
        </div>
        <!-- <button class="start-btn" @click="goToBoardsPage">Start as a guest</button> -->
      </main>
  <!-- <div class="homepage">
     <section class="header-home">
      <div class="logo">
         <span></span>Mello
      </div>
    </section>
    <div class="layout">
    <main class="main-home-page">
    <section class="started">
        <h1>Mello helpss teams move work forward</h1>
       <p class="txt-title"> 
         As your software team grows, Mello makes it easy to manage workflows across multiple teams and projects. Simple, intuitive, fast: Mello is where software teams do their best work.
         Free to get started, with easy user experience Mello.</p>
      <button class="start-btn" @click="goToBoardsPage">Start as a guest</button>
    </section>
        <div class="img">
          <img src="../assets/Asset3.png">
        </div>
</main>
</div>
  </div> -->
  </section>
</template>

<script>
export default {
  name: 'home',
  components: {
  },
  created() { },
  methods: {
    async goToBoardsPage() {
      // await this.$store.dispatch({ type: "goToBoardsPage" });
      this.$router.push("/board/624afa5e47cdb81018c1bc99");
    },
  },
};
</script>