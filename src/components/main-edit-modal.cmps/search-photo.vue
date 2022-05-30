<template>
    <section class="search-photo">
       <input ref="filterBy" @input="searchImg" class="img-search-input" type="text" placeholder="Search for photos">
       <section v-if="!isSearching">
       <h4>Suggested searches</h4>
       <div class="suggested-container flex wrap">
           <button @click="setSuggestSearch('Perspective')" class="btn-search-opt">Perspective</button>
           <button @click="setSuggestSearch('Productivity')" class="btn-search-opt">Productivity</button>
           <button @click="setSuggestSearch('Oraganization')" class="btn-search-opt">Oraganization</button>
           <button @click="setSuggestSearch('Colorful')" class="btn-search-opt">Colorful</button>
           <button @click="setSuggestSearch('Nature')" class="btn-search-opt">Nature</button>
           <button @click="setSuggestSearch('Business')" class="btn-search-opt">Business</button>
           <button @click="setSuggestSearch('Minimal')" class="btn-search-opt">Minimal</button>
           <button @click="setSuggestSearch('Space')" class="btn-search-opt">Space</button>
           <button @click="setSuggestSearch('Animals')" class="btn-search-opt">Animals</button>
       </div>
       </section>
       <section  v-if="res">
           <h4>Results</h4>
           <section class="search-results flex wrap">
              <div @click.stop="setImg(img)" class="res-container" v-for="img in res" :key="img"><img :src="img.small" alt=""></div>  
           </section>
       </section>
    </section>
</template>

<script>

import { filter } from 'lodash'
import { unsplashService } from '../../services/unsplash.service'
import { utilService } from '../../services/util.service'


export default {
    name: 'search-photo',
    props: {
        currTask: Object,
    },
    data(){
        return {
               isSearching: false,
               res: null  
        } 
    },
    created(){
        this.searchImg = utilService.debounce(this.searchImg, 1000)
    },
    methods: {
    async searchImg(){
        const val = this.$refs.filterBy.value
        if(!val){
            this.isSearching = false
            this.res = null
            return
        }
        this.res = await unsplashService.query(val)
        this.isSearching = true
            console.log(this.res)
        this.res = this.res.results.map(img =>{
           return {
               small: img.urls.thumb,
               regular: img.urls.regular,
               big: img.urls.full,
               asset_id: img.id,
               format: 'png',
               original_filename: img.alt_description,
               secure_url: img.urls.regular,
               created_at: img.created_at
               }
        })
     },
     setImg(img){
         if(!this.taskToEdit.style) this.taskToEdit.style = {}
         this.taskToEdit.style.bg = img.regular
         if(!this.taskToEdit.style.size) this.taskToEdit.style.size = 'big'
         if (!this.taskToEdit.attachments) this.taskToEdit.attachments = [];
        this.taskToEdit.attachments.push(img)
         this.$emit('taskUpdated', this.taskToEdit)
         this.$emit('closeSearch')
     },
     setSuggestSearch(filterBy){
         this.$refs.filterBy.value = filterBy
         this.searchImg()
     }

    },
    computed: {
        taskToEdit() {
            const task = JSON.parse(JSON.stringify(this.currTask))
            // if(!task.style) task.style = {}
            // task.style.bg = ''
            return task
        },
    },
    
}
</script>

<style>
</style>