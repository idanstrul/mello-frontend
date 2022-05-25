<template>
    <section class="trello-checklist">
        <trello-txt-input
            class="section-title text-m icon-checklist"
            :txt="updatedChecklist.title"
            @txt-saved="updateChecklistTitle"
            deny-empty-save
        >
            <button class="btn float-right btn-default" @click="openDeleteModal">Delete</button>
        </trello-txt-input>
        <!-- <span class="progress-count"></span> -->
        <el-progress :percentage="completePercentage" :status="passSuccess" />
        <!-- <div class="progress-bar"></div> -->
        <ul class="todos clean-list">
            <li v-for="(todo, todoIdx) in updatedChecklist.todos" :key="todo.id">
                <input type="checkbox" :checked="todo.isDone" @change="toggleTodoStatus(todoIdx)" />
                <trello-txt-input
                    :class="{done: todo.isDone}"
                    :txt="todo.title"
                    @txt-saved="updateTodoTitle($event, todo.id)"
                    @txt-is-empty="removeTodo(todoIdx)"
                >
                    <button class="remove-btn-quite" @click="removeTodo(todoIdx)"></button>
                    <template #edit-controlls>
                        <button class="remove-btn-quite" @click="removeTodo(todoIdx)"></button>
                    </template>
                </trello-txt-input>
            </li>
        </ul>
        <trello-txt-input
            class="make-btn"
            placeholder="Add an item"
            deny-empty-save
            reset-on-save
            @txt-saved="addTodo"
            allow-next
            ref="input"
        ></trello-txt-input>
        <Teleport v-if="isDeleteContentTeleported && isEditModalMounted" to=".teleport-container">
            <p class="msg">Deleting a checklist is permanent and there is no way to get it back.</p>
            <button @click="removeChecklist" class="delete-btn btn">Delete checklist</button>
        </Teleport>
        <!-- <pre>{{ updatedChecklist }}</pre> -->
    </section>
</template>

<script>
import { utilService } from "../../services/util.service"
import trelloTxtInput from "./trello-txt-input.vue"

export default {
    name: 'trello-checklist',
    props: {
        // modelValue: Object
        checklist: Object,
        isEditModalMounted: Boolean
    },
    data() {
        return {
            updatedChecklist: JSON.parse(JSON.stringify(this.checklist)),
            isDeleteContentTeleported: false
        }
    },
    methods: {
        saveChecklist() {
            const checklistToSave = JSON.parse(JSON.stringify(this.updatedChecklist))
            this.$emit('updated', checklistToSave)
        },
        toggleTodoStatus(todoIdx) {
            const todo = this.updatedChecklist.todos[todoIdx]
            todo.isDone = !todo.isDone
            this.saveChecklist()
        },
        updateChecklistTitle(updatedTitle) {
            this.updatedChecklist.title = updatedTitle
            this.saveChecklist()
        },
        updateTodoTitle(updatedTitle, todoId) {
            // console.log('updatedTitle', updatedTitle);
            // this.$emit('updated', this.updatedDesc)
            const idx = this.updatedChecklist.todos.findIndex(todo => todo.id === todoId)
            this.updatedChecklist.todos[idx].title = updatedTitle
            this.saveChecklist()
        },
        removeTodo(todoIdx) {
            this.updatedChecklist.todos.splice(todoIdx, 1)
            this.saveChecklist()

        },
        removeChecklist() {
            this.$emit('removed')
            this.$emit('editModalClosed')
        },
        addTodo(title) {
            this.updatedChecklist.todos.push({
                id: utilService.makeId(),
                title,
                isDone: false
            })
            this.saveChecklist()
        },
        next() {
            // console.log('event',event);
            // console.log(this.$refs.input.$el);
            this.$refs.input.$el.click()
            // event.target.click()
        },
        openDeleteModal(event) {
            this.isDeleteContentTeleported = true
            this.$emit('teleportContainerOpened', event)
        }

    },
    computed: {
        completePercentage() {
            const todos = this.updatedChecklist.todos
            const total = todos.length;
            if (total === 0) return 0
            const completed = todos.filter(todo => todo.isDone).length
            return Math.floor((completed / total) * 100)
        },
        passSuccess() {
            if (this.completePercentage === 100) return 'success'
            return ''
        }
    },
    watch: {
        isEditModalMounted(val) {
            if (!val) {
                this.isDeleteContentTeleported = false
            }
            // console.log('val', val);
            // console.log('this.isDeleteContentTeleported', this.isDeleteContentTeleported);
        }
    },
    components: {
        trelloTxtInput
    }

}

</script>

<style>
</style>