<template>
    <section class="trello-dates">
        <span class="secondary-section-title">Due date</span>
        <div class="flex-container flex align-center">
            <input type="checkbox" />
            <button class="btn-default flex align-center" @click="openEditModal">
                {{ formatDueDate }}
                <span v-if="status !== 'in-progress'" class="status-tag" :class="status">{{ status }}</span>
                <!-- <span class="sc-bdVaJa jKipYA" role="img" aria-label="DownIcon"> -->
                <svg
                    width="24"
                    height="24"
                    role="presentation"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z"
                        fill="currentColor"
                    />
                </svg>
                <!-- </span> -->
            </button>
        </div>
    </section>
</template>

<script>

import format from 'date-fns/format'


export default {
    name: 'trello-dates',
    props: {
        dueDate: Number,
        status: String
    },
    methods: {
        openEditModal(event) {
            console.log('event', event);
            this.$emit('editModalOpened', event, 'dateEdit')
        }
    },
    computed: {
        formatDueDate() {
            return format(this.dueDate, 'MMM d') + ' at ' + format(this.dueDate, 'HH:MM')
            // const options = { month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric' }
            // return new Date(this.dueDate).toLocaleString(undefined, options)
        }
    }
}
</script>

<style>
</style>