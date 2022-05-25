<template>
    <section class="activity-log">
        <span class="section-title text-m icon-activity">Activity</span>
        <ul class="clean-list">
            <li>
                <user-avatar :user="user"></user-avatar>
                <trello-txt-input
                    placeholder="Write a comment..."
                    deny-empty-save
                    reset-on-save
                    @txt-saved="addComment"
                ></trello-txt-input>
            </li>
            <li v-for="comment in updatedComments" :key="comment.id">
                <!-- <div class="flex-container"> -->
                <user-avatar :user="comment.byMember"></user-avatar>
                <span class="user-fullname">{{ comment.byMember.fullname }}</span>
                <span class="comment-time">{{ formatCreatedAt(comment.createdAt) }}</span>
                <!-- </div> -->
                <p>{{ comment.txt }}</p>
            </li>
            <!-- <pre>{{updatedComments}}</pre> -->
            <!-- <pre>{{byMember}}</pre> -->
        </ul>
    </section>
</template>

<script>
import { utilService } from "../../services/util.service"
import userAvatar from "../user-avatar.vue"
import trelloTxtInput from "./trello-txt-input.vue"
import format from 'date-fns/format'


export default {
    name: 'activity-log',
    props: {
        comments: Array,
        default: []
    },
    data() {
        return {
            updatedComments: (this.comments) ? JSON.parse(JSON.stringify(this.comments)) : [],

            byMember: this.$store.getters.getMyMiniUser
            //should be the logged in user
        }
    },
    methods: {
        formatCreatedAt(timeStamp) {
            return format(timeStamp, 'MMM d') + ' at ' + format(timeStamp, 'HH:MM')
            const options = { month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric' }
            return new Date(timeStamp).toLocaleString(undefined, options)
        },
        addComment(newCommentTxt) {
            const newComment = {
                id: utilService.makeId(),
                txt: newCommentTxt,
                createdAt: Date.now(),
                byMember: this.byMember
            }
            this.updatedComments.unshift(newComment)
            this.$emit('updated', JSON.parse(JSON.stringify(this.updatedComments)))
        },
    },
    computed: { 
    user(){
        console.log(this.$store.getters.loggedinUser);
        return this.$store.getters.loggedinUser
    }
    },
    components: {
        userAvatar,
        trelloTxtInput
    }
}
</script>

<style>
</style>