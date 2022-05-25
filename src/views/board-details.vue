<template>
  <section v-if="board" class="board-details">
    <div class="bg"></div>
    <board-header @starBoard="starBoard" :board="board"></board-header>
    <router-view></router-view>

    <div class="group-list flex">
      <!-- <Container>  -->
      <Container group-name="cols" tag="div" orientation="horizontal" @drop="onColumnDrop($event)">
        <Draggable v-for="(group) in board.groups" :key="group.id">
          <div>
            <board-group
              :group="group"
              @updateGroup="updateGroup"
              @saveGroup="updateGroup"
              @removeGroup="removeGroup"
            >
              <Container
                orientation="vertical"
                group-name="col-items"
                :shouldAcceptDrop="(e, payload) => (e.groupName === 'col-items')"
                :get-child-payload="getCardPayload(group.id)"
                @drop="(e) => onCardDrop(group.id, e)"
              >
                <task-preview
                  @due-soon="task.status = 'due-soon'"
                  @in-progress="task.status = 'in-progress'"
                  @over-due="task.status = 'over-due'"
                  @done="task.status = 'done'"
                  @saveTask="saveTask(task, group.id)"
                  @openLabels="labelsOpen = !labelsOpen"
                  :labelsOpen="labelsOpen"
                  @click="goToDetail(group, task)"
                  v-for="task in group.tasks"
                  :key="task.id"
                  :task="task"
                  @removeTask="removeTask(task, group)"
                ></task-preview>
              </Container>
            </board-group>
          </div>
        </Draggable>
      </Container>
      <!-- <Container 
    :group="group"
    orientation="vertical"
    group-name="col-items"
    :shouldAcceptDrop="(e, payload) =>  (e.groupName === 'col-items')"
    :get-child-payload="getCardPayload(group.id)"
    @drop="(e) => onCardDrop(group.id, e)">
      </Container>-->
      <!-- </Container> -->
      <group-add
        @addGroup="isAddingGroup = false"
        @saveGroup="updateGroup"
        @closeGroupAdd="isAddingGroup = true"
        :isAddingGroup="isAddingGroup"
      ></group-add>
    </div>
    <!-- <p>{{board.title}}</p> -->
  </section>
</template>

<script>

// import { boardService } from '../services/board.service.js'
import { Container, Draggable } from "vue3-smooth-dnd";
import { utilService } from "../services/util.service";
import boardGroup from "../components/board-group.vue";
import groupAdd from "../components/group-add.vue";
import boardHeader from "../components/board-header.vue";
import taskPreview from "../components/task-preview.vue";
/*import { SOCKET_EMIT_BOARD_WATCH } from "../services/socket.service";
import { SOCKET_EMIT_BOARD_UPDATE } from "../services/socket.service";
import bg from '../../src/assets/bg.'
import TaskPreview from "../components/task-preview.vue";*/

export default {
  name: 'board-details',
  data() {
    return {
      // board: null,
      isAddingGroup: true,
      labelsOpen: false,
      loadDate: false,
    }
  },
  components: {
    boardGroup,
    groupAdd,
    Container,
    Draggable,
    boardHeader,
    taskPreview
  },
  async mounted() {
    //  await this.loadBoard()
    const { boardId } = this.$route.params
    const board = await this.$store.dispatch({ type: 'loadCurrBoard', boardId })
    // this.board = board
    if (!this.board.style) return
    document.body.style = `
   background-image: url(${this.board.style.bg});
   background-color: ${this.board.style.bg};`
   console.log(this.board);
  },
  unmounted(){
 document.body.style = `
   background: none;`
  },
  computed: {
    board() {
      return this.$store.getters.currBoard
    },
    unfilteredBoard() {
      return this.$store.state.boardStore.currBoard;
    },
  },
  methods: {
    async starBoard(star){
      const board = this.$store.getters.currBoard
      board.star = star
      await this.$store.dispatch({type: 'saveCurrBoard', boardToSave: board})
    },
    async saveTask(taskToSave, groupId) {

      // console.log('hi');
      // console.log(taskToSave, groupIdx);
      const board = await this.$store.dispatch({ type: 'saveTask', groupId, taskToSave })
      // this.board = board
      // this.loadBoard()
      // this.board = board
      // this.board.groups[groupIdx].tasks.findIndex(t => t.id === taskToSave.id)
      // this.updateGroup(this.board.groups[groupIdx])
      // await this.$store.dispatch({type: 'updateGroup', groupToSave})

      // const idx = this.board.groups.findIndex(g => g.id === groupId)
      // this.board.groups[idx].tasks
      //this.socketUpdateBoard();
    },
    async removeGroup(group) {
      const board = await this.$store.dispatch({ type: 'removeGroup', group })
      // this.board = board
      // this.socketUpdateBoard();
    },
    async removeTask(task, group) {
      const board = await this.$store.dispatch({ type: 'removeTask', groupId: group.id, taskId: task.id })
      // this.board = board
      //this.socketUpdateBoard();
    },
    async updateGroup(groupToSave) {
      if (!this.isAddingGroup) this.isAddingGroup = true
      // console.log(groupToSave);
      if (!groupToSave.title) return
      const board = await this.$store.dispatch({ type: 'updateGroup', groupToSave })
      // this.board = board
      //this.socketUpdateBoard();
    },
    async loadBoard() {
      const { boardId } = this.$route.params
      const board = await this.$store.dispatch({ type: 'loadCurrBoard', boardId })
      // const board = this.$store.getters.currBoard
      this.board = board
      if (!this.board.style) return board
      document.body.style = `
    background-image: url(${this.board.style.bg});
    background-color: ${this.board.style.bg};`
      return board
    },
    async onColumnDrop(dropResult) {
      const scene = Object.assign({}, this.board)
      console.log(scene);
      dropResult.payload = {}
      dropResult.payload.data = this.board.groups[dropResult.removedIndex]
      dropResult.payload.id = this.board.groups[dropResult.removedIndex].id
      console.log('drop>>', dropResult);
      scene.groups = utilService.applyDrag(scene.groups, dropResult)
      // this.board = JSON.parse(JSON.stringify(scene))
      const board = await this.$store.dispatch({ type: 'saveCurrBoard', boardToSave: scene })
    },
    getCardPayload(groupId) {
      return index => {
        return this.board.groups.filter(p => p.id === groupId)[0].tasks[index]
      }
    },
    async onCardDrop(groupId, dropResult) {
      console.log(dropResult);
      // check if element where ADDED or REMOVED in current collumn
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {

        const scene = Object.assign({}, this.board)
        const column = scene.groups.filter(p => p.id === groupId)[0]
        const itemIndex = scene.groups.indexOf(column)
        const newColumn = Object.assign({}, column)

        // check if element was ADDED in current column
        if ((dropResult.removedIndex == null && dropResult.addedIndex >= 0)) {
          // your action / api call
          // dropResult.payload.loading = true
          // simulate api call
          // setTimeout(function(){ dropResult.payload.loading = false }, (Math.random() * 5000) + 1000); 
        }

        newColumn.tasks = utilService.applyDrag(newColumn.tasks, dropResult)
        scene.groups.splice(itemIndex, 1, newColumn)
        // this.board = JSON.parse(JSON.stringify(scene))
        const board = await this.$store.dispatch({ type: 'saveCurrBoard', boardToSave: scene })
        // this.board = board
        // this.$emit('move', scene)
        // console.log(scene);
        // this.board = scene
      }
    },
    // async move(boardToSave){
    //   const board = await this.$store.dispatch({type: 'saveCurrBoard', boardToSave})
    //   this.loadBoard()
    // },
    goToDetail(group, task) {
      this.$router.push(`/board/${this.board._id}/task/${group.id}/${task.id}`)
    },
    /*socketUpdateBoard() {
     console.log("SOCKETUPDATEBOARDMOTHREREUFJKER SOCKETING");
     socketService.emit(SOCKET_EMIT_BOARD_UPDATE, this.unfilteredBoard);
   },*/
  },
  watch: {
    '$route.params.boardId'(id) {
      if (!id) return
      console.log('Changed to', id)
      this.loadBoard()
      { immediate: true }
    },
    // '$route.params'(p) {
    //   if (!p.boardId) return
    //   if (!p.taskId)
    //     this.loadBoard()
    //   //  socketService.emit(SOCKET_EMIT_BOARD_WATCH, this.boardId);
    //   { immediate: true }
    // },
  }
}
</script>
<style>
/** NB: dont remove, 
* When using orientation="horizontal" it auto sets "display: table"
* In this case we need flex and not display table  
*/
.smooth-dnd-container.horizontal {
  display: flex !important;
}
</style>