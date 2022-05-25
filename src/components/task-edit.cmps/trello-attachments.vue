<template>
    <section class="trello-attachments">
        <div class="section-title text-m icon-attachment">Attachments</div>
        <ul class="attachments clean-list">
            <li
                class="flex align-center"
                v-for="(attachment, attachmentIdx) in attachments"
                :key="attachment.asset_id"
            >
                <img
                    class="img-preview"
                    :src="attachment.secure_url"
                    :alt="attachment.original_filename"
                />
                <p class="file-details">
                    <span
                        class="attachment-name"
                    >{{ attachment.original_filename + '.' + attachment.format }}</span>
                    <span class="attachment-addedAt">Added at {{ formatCreatedAt(attachment) }}</span>
                    <span class="attachment-delete">
                        <a href="#" @click.prevent="openDeleteModal($event, attachmentIdx)">Delete</a>
                    </span>
                    <span class="attachment-edit-name">
                        <a href="#" @click.prevent="openNameModal($event, attachmentIdx)">Edit</a>
                    </span>
                    <span class="attachment-make-cover">
                        <a href="#" @click.prevent="makeCover(attachmentIdx)">Make-cover</a>
                    </span>
                </p>
            </li>
        </ul>
        <button class="btn" @click="openEditModal">Add an attachment</button>
        <Teleport v-if="isDeleteContentTeleported && isEditModalMounted" to=".teleport-container">
            <p class="msg">Deleting an attachment is permanent. There is no undo.</p>
            <button @click="removeAttachment" class="delete-btn btn">Delete</button>
        </Teleport>
        <!-- <pre>{{ attachments }}</pre> -->
    </section>
</template>

<script>
import format from 'date-fns/format'


export default {
    name: 'trello-attachments',
    props: {
        attachments: Array,
        isEditModalMounted: Boolean
    },
    data() {
        return {
            attachmentToEditIdx: NaN,
            isDeleteContentTeleported: false,
            isNameContentTeleported: false,
        }
    },
    methods: {
        removeAttachment() {
            // console.log('removeing');
            this.updatedAttachments.splice(this.attachmentToEditIdx, 1)
            this.$emit('updated', this.updatedAttachments)
            this.$emit('editModalClosed')
        },
        openEditModal(event) {
            this.$emit('editModalOpened', event)
        },
        openDeleteModal(event, attachmentIdx) {
            console.log('event', event);
            this.attachmentToEditIdx = attachmentIdx
            this.isDeleteContentTeleported = true
            this.$emit('teleportContainerOpened', event)
        },
        openNameModal(event, attachmentIdx) {
            this.attachmentToEditIdx = attachmentIdx
            this.isNameContentTeleported = true
            this.$emit('teleportContainerOpened', event)
        },
        formatCreatedAt(attachment) {
            // return attachment.created_at
            const createdAt = new Date(attachment.created_at).getTime()
            console.log('createdAt', createdAt);
            return format(createdAt, 'MMM d') + ' at ' + format(createdAt, 'HH:MM')
        }
        // saveChecklist() {
        //     const checklistToSave = JSON.parse(JSON.stringify(this.updatedChecklist))
        //     this.$emit('updated', checklistToSave)
        // },
        // toggleTodoStatus(todoIdx) {
        //     const todo = this.updatedChecklist.todos[todoIdx]
        //     todo.isDone = !todo.isDone
        //     this.saveChecklist()
        // },
        // updateChecklistTitle(updatedTitle) {
        //     this.updatedChecklist.title = updatedTitle
        //     this.saveChecklist()
        // },
        // updateTodoTitle(updatedTitle, todoId) {
        //     // console.log('updatedTitle', updatedTitle);
        //     // this.$emit('updated', this.updatedDesc)
        //     const idx = this.updatedChecklist.todos.findIndex(todo => todo.id === todoId)
        //     this.updatedChecklist.todos[idx].title = updatedTitle
        //     this.saveChecklist()
        // },
        // removeTodo(todoIdx) {
        //     this.updatedChecklist.todos.splice(todoIdx, 1)
        //     this.saveChecklist()

        // },
        // addTodo(title) {
        //     this.updatedChecklist.todos.push({
        //         id: utilService.makeId(),
        //         title,
        //         isDone: false
        //     })
        //     this.saveChecklist()
        // },
        // next() {
        //     // console.log('event',event);
        //     // console.log(this.$refs.input.$el);
        //     this.$refs.input.$el.click()
        //     // event.target.click()
        // }

    },
    computed: {
        updatedAttachments() {
            return JSON.parse(JSON.stringify(this.attachments))
        }
    },
    watch: {
        isEditModalMounted(val) {
            if (!val) {
                this.isDeleteContentTeleported = false
                this.isNameContentTeleported = false
            }
            // console.log('val', val);
            // console.log('this.isDeleteContentTeleported', this.isDeleteContentTeleported);
        }
    }

}
</script>

<style>
</style>