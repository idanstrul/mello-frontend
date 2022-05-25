<template>
    <section class="trello-members">
        <span class="secondary-section-title">Members</span>
        <ul class="clean-list">
            <li v-for="member in members" :key="member._id" @click="openEditModal">
                <user-avatar :user="member" :diameter="32"></user-avatar>
            </li>
            <li>
                <button class="btn-round" @click="openEditModal"></button>
            </li>
        </ul>
    </section>
</template>

<script>
import userAvatar from "../user-avatar.vue";

export default {
    name: 'trello-members',
    props: {
        members: Array
    },
    methods: {
        openEditModal(event) {
            console.log('event', event);
            this.$emit('editModalOpened', event, 'membersEdit')
        }
    },
    components: {
        userAvatar
    }
}
</script>

<style>
</style>