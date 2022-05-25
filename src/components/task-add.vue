<template>

    <section class="task-add">
        <form action="submit" @submit.prevent.stop="saveTask">
            <textarea
                ref="taskTitle"
                style="resize: none; width: 256px; height: 66px"
                placeholder="Enter a title for this card..."
                v-model="task.title"
            />
            <div>
                <button type="submit">Add card</button>
                <button @mouseover="isSave = false" @mouseleave="isSave = true" title="Close"></button>
            </div>
        </form>
    </section>
</template>

<script>
export default {
    name: 'task-add',
    props: {
        task: Object,
    },
    data() {
        return {
            isSave: true
        }
    },
    methods: {
        saveTask() {
            if (!this.isSave) this.task.title = ''
            console.log(this.task)
            this.$emit('saveTask', this.task)
        },
        func() {
            console.log('hover');
        }
    },
    mounted() {
        this.$refs.taskTitle.focus()
    }
}
</script>

<style>
</style>