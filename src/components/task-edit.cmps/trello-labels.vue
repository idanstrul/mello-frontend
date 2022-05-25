<template>
    <section class="trello-labels">
        <span class="secondary-section-title">Labels</span>
        <ul class="clean-list flex wrap">
            <li v-for="label in labels" :key="label.id">
                <div class="label" :style="{ 'background-color': label.color }" @click="openEditModal">
                    {{label.title}}
                </div>
            </li>
            <li>
                <button class="add-label btn-default" @click="openEditModal"></button>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    name: 'trello-labels',
    props: {
        labels: Array
    },
    methods: {
        openEditModal(event){
            // console.log('event',event);
            this.$emit('editModalOpened', event, 'labelsEdit' )
        }
    }
}
</script>

<style>
</style>