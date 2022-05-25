<template>
    <section class="checklists-edit">
        <span class="secondary-section-title">Title</span>
        <input class="search" type="text" v-focus v-model="newChecklist.title" />
        <span class="secondary-section-title">Copy items from...</span>
        <select v-model="todosToCopy" multiple>
            <option :value="[]">(none)</option>
            <optgroup v-for="task in checklists" :key="task.taskId" :label="task.taskTitle">
                <option
                    v-for="checklist in task.checklists"
                    :key="checklist.id"
                    :value="checklist.todos"
                >{{ checklist.title }}</option>
            </optgroup>
        </select>
        <button class="primary-btn" @click="createChecklist">Add</button>
        <!-- <pre>{{todosToCopy}}</pre> -->
        <!-- <pre>{{ taskToEdit }}</pre> -->
        <!-- <pre>{{ checklists }}</pre> -->
    </section>
</template>

<script>
import { utilService } from "../../services/util.service"

export default {
    name: 'checklists-edit',
    props: {
        currTask: Object
    },
    data() {
        return {
            newChecklist: {
                id: '',
                title: 'Checklist',
                todos: []
            },
            todosToCopy: []
        }
    },
    methods: {
        createChecklist() {
            this.newChecklist.id = utilService.makeId()
            this.newChecklist.todos = JSON.parse(JSON.stringify(this.todosToCopy.flat()))
                .map(todo => {
                    console.log('todo',todo);
                    todo.id = utilService.makeId()
                    return todo
                })
            // console.log('newTodos', newTodos);
            // console.log('this.todosToCopy',this.todosToCopy);
            if (!this.taskToEdit.checklists) this.taskToEdit.checklists = [];
            this.taskToEdit.checklists.push(JSON.parse(JSON.stringify(this.newChecklist)))
            // console.log('this.taskToEdit', this.taskToEdit);
            this.$emit('taskUpdated', this.taskToEdit)
            this.newChecklist = {
                id: null,
                title: 'Checklist',
                todos: []
            }
            this.$emit('modalClosed')

        }
    },
    computed: {
        checklists() {
            return this.$store.getters.currBoardChecklists
        },
        taskToEdit() {
            return JSON.parse(JSON.stringify(this.currTask))
        }
    }
}
</script>

<style>
</style>