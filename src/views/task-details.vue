<template>
  <!-- v-clickoutside="closeModal" -->
  <section v-if="currTask" class="task-details">
    <div class="modal-screen flex center">
      <div v-clickoutside="closeModal" class="modal-container flex column center">
        <!-- v-clickoutside="closeModal" -->
        <div v-if="false" class="cover"></div>
        <div class="cover" v-if="currTask.style">
          <img
            v-if="currTask.style && currTask.style.bg.split('')[0] !== '#'"
            :src="currTask.style.bg"
            alt
          />
          <div :style="getCoverClr" class="cover-clr" v-else></div>
        </div>
        <button class="exit-btn" @click="closeModal"></button>
        <div class="modal-header section-title text-l icon-task-title">
          {{ currTask.title }}
          <div class="group-data">
            in list
            <a @click.prevent href="#">{{ parentGroupName }}</a>
          </div>
        </div>
        <div class="flex-container flex space-between">
          <div class="modal-main">
            <div v-if="hasMembers || hasLabels || currTask.dueDate" class="notations flex wrap">
              <trello-members
                v-if="hasMembers"
                :members="currTask.members"
                @editModalOpened="openEditModal"
              ></trello-members>
              <trello-labels
                v-if="hasLabels"
                :labels="currTaskLabels"
                @editModalOpened="openEditModal"
              ></trello-labels>
              <trello-dates
                v-if="currTask.dueDate"
                :dueDate="currTask.dueDate"
                :status="currTask.status"
                @editModalOpened="openEditModal"
              ></trello-dates>
            </div>
            <div v-else class="gutter"></div>
            <div class="description">
              <span class="section-title text-m icon-description">Description</span>
              <trello-txt-input
                class="make-btn"
                :txt="currTask.description"
                placeholder="Add a more detailed description…"
                @txt-saved="updateDesc"
                @txt-is-empty="updateDesc"
              ></trello-txt-input>
            </div>
            <div v-if="hasAttachments" class="attachments">
              <trello-attachments
                :attachments="currTask.attachments"
                :isEditModalMounted="isEditModalMounted"
                @editModalOpened="openEditModal($event, 'attachmentEdit')"
                @teleportContainerOpened="openEditModal($event, 'teleportContainer', 'Delete attachment?')"
                @updated="updateAttachments"
              ></trello-attachments>
            </div>
            <div v-if="true" class="checklists">
              <trello-checklist
                v-for="(checklist, checklistIdx) in currTask.checklists"
                :key="checklist.id"
                :checklist="checklist"
                :isEditModalMounted="isEditModalMounted"
                @updated="updateChecklist"
                @removed="removeChecklist(checklistIdx)"
                @editModalClosed="closeEditModal"
                @teleportContainerOpened="openEditModal($event, 'teleportContainer', 'Delete Checklist?')"
              ></trello-checklist>
            </div>
            <div class="activity-log">
              <activity-log :comments="currTask.comments" @updated="updateComments"></activity-log>
            </div>
          </div>
          <div class="modal-sidebar flex column">
            <!-- <button class="btn side-bar">Join</button> -->
            <span class="secondary-section-title">Add to card</span>
            <button
              class="btn side-bar icon-members"
              @click="openEditModal($event, 'members-edit')"
            >Members</button>
            <button
              class="btn side-bar icon-labels"
              @click="openEditModal($event, 'labels-edit')"
            >Labels</button>
            <button
              class="btn side-bar icon-checklist"
              @click="openEditModal($event, 'checklists-edit')"
            >Checklist</button>
            <button
              class="btn side-bar icon-dates"
              @click="openEditModal($event, 'date-edit')"
            >Dates</button>
            <button
              class="btn side-bar icon-attachment"
              @click="openEditModal($event, 'attachment-edit')"
            >Attachment</button>
            <button
              class="btn side-bar icon-cover"
              @click="openEditModal($event, 'cover-edit')"
            >Cover</button>
            <span class="secondary-section-title">Actions</span>
            <!-- <button class="btn side-bar icon-move" @click="openEditModal($event, 'move-edit')">Move</button> -->
            <button class="btn side-bar icon-copy" @click="openEditModal($event, 'copy-edit')">Copy</button>
            <button class="btn delete-btn side-bar icon-delete" @click="openDeleteModal">Delete</button>
          </div>
        </div>
        <Transition
          enter-active-class="animate__animated animate__fadeIn animate__faster"
          leave-active-class="animate__animated animate__fadeOut animate__faster"
        >
          <main-edit-modal
            v-if="editModalStatus.isOpen"
            :modal-title="editModalStatus.title"
            @editModalClosed="closeEditModal"
            :pos="editModalStatus.pos"
            @mounted="this.isEditModalMounted = true"
            @unmounted="this.isEditModalMounted = false"
          >
            <component
              :is="editModalStatus.editType"
              :currTask="currTask"
              @taskUpdated="saveCurrTask"
              @editModalClosed="closeEditModal"
              @labelUpdated="updateLabel"
              @openSearch="openEditModal(undefined, 'search-photo')"
              @closeSearch="openEditModal(undefined, 'cover-edit')"
            ></component>
          </main-edit-modal>
        </Transition>

        <Teleport v-if="isDeleteContentTeleported && isEditModalMounted" to=".teleport-container">
          <p
            class="msg"
          >All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.</p>
          <button @click="removeTask" class="delete-btn btn">Delete</button>
        </Teleport>
        <!-- <main-edit-modal v-if="editModalStatus.isOpen && editModalStatus.editType==='search-photo'" modal-title="se" @editModalClosed="closeEditModal" :pos="editModalStatus.pos">
          <component
            :is="editModalStatus.editType"
            :currTask="currTask"
            @taskUpdated="saveCurrTask"
            @editModalClosed="closeEditModal"
          ></component>
        </main-edit-modal>-->
        <!-- <date-edit></date-edit> -->
        <!-- <pre>{{ currTask }}</pre> -->
        <!-- <pre>{{ currTaskLabels }}</pre> -->
      </div>
    </div>
  </section>
</template>

<script>
import trelloLabels from "../components/task-edit.cmps/trello-labels.vue"
import trelloMembers from "../components/task-edit.cmps/trello-members.vue"
import activityLog from "../components/task-edit.cmps/activity-log.vue"
import trelloChecklist from "../components/task-edit.cmps/trello-checklist.vue"
import trelloTxtInput from "../components/task-edit.cmps/trello-txt-input.vue"
import trelloDates from "../components/task-edit.cmps/trello-dates.vue"
import mainEditModal from './main-edit-modal.vue'
import labelsEdit from '../components/main-edit-modal.cmps/labels-Edit.vue'
import membersEdit from '../components/main-edit-modal.cmps/members-edit.vue'
import checklistsEdit from '../components/main-edit-modal.cmps/checklists-edit.vue'
import dateEdit from '../components/main-edit-modal.cmps/date-edit.vue'
import attachmentEdit from "../components/main-edit-modal.cmps/attachment-edit.vue"
import trelloAttachments from "../components/task-edit.cmps/trello-attachments.vue"
import coverEdit from "../components/main-edit-modal.cmps/cover-edit.vue"
import teleportContainer from "../components/main-edit-modal.cmps/teleport-container.vue"
import searchPhoto from "../components/main-edit-modal.cmps/search-photo.vue"

export default {
  name: 'task-details',
  async created() {
    this.currTaskId = this.$route.params.taskId
    this.parentGroupId = this.$route.params.groupId
    this.parentGroupName = this.$store.getters.currBoard.groups.find(g => g.id === this.parentGroupId).title
    const { groupId, taskId } = this.$route.params
    // this.currTask = await this.$store.dispatch({ type: 'getTaskById', groupId: this.parentGroupId, taskId: this.currTaskId })
    // if (!this.currTask.labelIds) return
    // This should be computed boardLabels
    await this.$store.dispatch({ type: 'loadCurrTask', groupId, taskId })
    // console.log('this.currTask after dispatch', this.currTask)
    // const boardLabels = this.$store.getters.currBoardLabels
    // Should be in a function
    // if (!this.currTask.labelIds || !this.currTask.labelIds.length) return
    // this.currTaskLabels = this.boardLabels.filter(label =>
    //   this.currTask.labelIds.includes(label.id))
  },
  data() {
    return {
      editModalStatus: {
        isOpen: false,
        editType: '',
        pos: null,
        title: ''
      },
      isDeleteContentTeleported: false,
      isEditModalMounted: false,
      // currTask: null,
      // currTaskLabels: null,
      currTaskId: '',
      parentGroupId: '',
      parentGroupName: ''
    }
  },
  mounted() {

    // console.log('check', this.currTask.style.bg.split('')[0] !== '#');
  },

  methods: {

    checkImg() {
      return this.currTask.style.bg.split('')[0] !== '#'
    },
    openSearch() {
      this.editModalStatus.editType = 'search-photo'
    },
    async saveCurrTask(updatedTask = null) {
      // Logic to support updatedTask param which only comes when updating from edit modal
      const taskToSave = updatedTask ? updatedTask : this.currTask
      await this.$store.dispatch({
        type: 'saveTask',
        groupId: this.parentGroupId,
        taskToSave: JSON.parse(JSON.stringify(taskToSave))
      })
      //await this.socketUpdateBoard();
      console.log('Current task saved!');
      /// This function returns a promise with the value of 
      //the current board. I'm not sure if methods 
      //inside this component that call SaveCurrTask 
      //should wait for this promise to resolve or not. 
      //if it will cuase problems with saving tasks this 
      //could be the reason 
    },
    async removeTask() {
      const groupId = this.$route.params.groupId
      const board = await this.$store.dispatch({ type: 'removeTask', groupId, taskId: this.currTask.id })
      this.$router.push(`/board/${board._id}`)
    },
    updateDesc(updatedDesc) {
      console.log('updatedDesc', updatedDesc);
      this.currTask.description = updatedDesc
      this.saveCurrTask()
    },
    updateChecklist(updatedChecklist) {
      // console.log('updatedChecklist', updatedChecklist);
      const idx = this.currTask.checklists.findIndex(cl => cl.id === updatedChecklist.id)
      this.currTask.checklists[idx] = updatedChecklist
      this.saveCurrTask()
    },
    updateLabel(updatedLabel) {
      updatedLabel = JSON.parse(JSON.stringify(updatedLabel))
      this.$store.dispatch({ type: 'updateLabel', label: updatedLabel })
    },
    removeChecklist(checklistIdx) {
      this.currTask.checklists.splice(checklistIdx, 1)
      this.saveCurrTask()
    },
    updateComments(updatedComments) {
      this.currTask.comments = updatedComments
      this.saveCurrTask()
    },
    updateAttachments(updatedAttachments) {
      this.currTask.attachments = updatedAttachments
      this.saveCurrTask()
    },
    closeModal() {
      this.saveCurrTask()
      const boardId = this.$route.params.boardId
      // console.log('boardId',boardId);
      this.$router.push({ name: 'board', params: { boardId } })
      //this.socketUpdateBoard();
    },
    openDeleteModal(event) {
      // console.log('event', event);
      this.isDeleteContentTeleported = true
      this.openEditModal(event, 'teleportContainer', 'Delete card?')
    },
    openEditModal(event, editType, title = '') {
      console.log('event', event);
      // console.log('editType',editType);
      // console.log('event.target.getBoundingClientRect()', event.target.getBoundingClientRect());
      var pos;
      if (!event) pos = this.pos;
      else {
        const clickedElArea = event.target.getBoundingClientRect()
        pos = {
          x: clickedElArea.x,
          y: clickedElArea.y - clickedElArea.height - 10
        }
      }

      if (!title) {
        switch (editType) {
          case 'labels-edit':
          case 'labelsEdit':
            // console.log('inside switch labels edit');
            title = 'Labels'
            break
          case 'members-edit':
          case 'membersEdit':
            title = 'Members'
            break
          case 'checklists-edit':
          case 'checklistsEdit':
            title = 'Add checklist'
            break
          case 'date-edit':
          case 'dateEdit':
            title = 'Dates'
            break
          case 'attachment-edit':
          case 'attachmentEdit':
            title = 'Attach from computer'
            break
          case 'cover-edit':
          case 'coverEdit':
            title = 'Cover'
            break
          case 'search-photo':
          case 'searchPhoto':
            title = 'Photo search'
        }
      }

      console.log('title', title);

      const status = {
        isOpen: true,
        editType,
        pos,
        title
      }
      this.editModalStatus = status
      // this.$store.commit({ type: 'toggleEditModal', isOpen: true, editType, currTask: this.currTask, parentGroupId: this.parentGroupId })
    },
    closeEditModal() {
      this.editModalStatus = {
        isOpen: false,
        editType: '',
        pos: null,
        title: ''
      }
    }
  },
  computed: {
    getCoverClr() {
      return `background-color: ${this.currTask.style.bg} !important`
    },
    boardLabels() {
      return this.$store.getters.currBoardLabels
    },
    hasLabels() {
      return (this.currTaskLabels && this.currTaskLabels.length > 0)
    },
    hasMembers() {
      if (!this.currTask) return
      return (this.currTask.members && this.currTask.members.length > 0)
    },
    hasAttachments() {
      return (this.currTask.attachments && this.currTask.attachments.length)
    },
    currTask() {
      return this.$store.getters.getCurrTask
    },
    currTaskLabels() {
      if (!this.currTask.labelIds || !this.currTask.labelIds.length) return []
      return this.boardLabels.filter(label =>
        this.currTask.labelIds.includes(label.id))
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
  // watch: {
  //   this.updatedTask: {

  //   }
  // },
  components: {
    mainEditModal,
    trelloLabels,
    trelloMembers,
    activityLog,
    trelloChecklist,
    trelloTxtInput,
    trelloDates,
    labelsEdit,
    membersEdit,
    checklistsEdit,
    dateEdit,
    attachmentEdit,
    trelloAttachments,
    coverEdit,
    teleportContainer,
    searchPhoto

  }
}
</script>

<style>
</style>