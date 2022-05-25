<template>
    <div class="user-avatar" :style="getSizeInCss">
        <img v-if="user.imgUrl" :src="user.imgUrl" />
        <div class="flex center" v-else :style="userColor">{{ getNameAbbreviation(user.fullname) }}</div>
        <!-- {{user}} -->
    </div>
</template>

<script>
import { utilService } from "../services/util.service"

export default {
    name: 'user-avatar',
    props: {
        user: Object,
        diameter: {
            type: Number,
            default: 28
        }
    },
    methods: {
        getNameAbbreviation(fullName) {
            console.error('fullName' , fullName)
            if (!fullName) return '❓'
            const names = fullName.split(' ')
            // console.log('names', names);
            // console.log(this.user);
            const initiates = names.map(n => n.charAt(0).toUpperCase())
            return initiates.join('')
        }
    },
    computed: {
        userColor() {
            // console.log(this.user.color);
            const colorToShow = this.user.color || utilService.getRandomColor()
            return `background-color: ${colorToShow}`
        },
        getSizeInCss(){
            return {
                width: this.diameter + 'px',
                height: this.diameter + 'px',
                'line-height': this.diameter + 'px' 
            }
        }
    }
}
</script>

<style>
</style>