<template>
  <section v-if="board" class="board-details">
    <div class="bg"></div>
    <board-header @starBoard="starBoard" :board="board"></board-header>
    <router-view></router-view>

    <div class="group-list flex">
      <Container
        :drop-placeholder="{
          className: `col-drop`,
          animationDuration: '100',
          showOnTop: false,
        }"
        drag-class="col-drag"
        group-name="cols"
        tag="div"
        orientation="horizontal"
        @drop="onColumnDrop($event)"
        @touchend="enableScroll"
      >
        <!-- @drag-end="enableScroll" -->
        <!-- :drag-begin-delay="2000" -->
        <Draggable v-for="group in board.groups" :key="group.id">
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
                :shouldAcceptDrop="(e, payload) => e.groupName === 'col-items'"
                :get-child-payload="getCardPayload(group.id)"
                :drop-placeholder="{
                  className: `item-drop`,
                  animationDuration: '200',
                  showOnTop: true,
                }"
                drag-class="item-drag"
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
      <group-add
        @addGroup="isAddingGroup = false"
        @saveGroup="updateGroup"
        @closeGroupAdd="isAddingGroup = true"
        :isAddingGroup="isAddingGroup"
      ></group-add>
    </div>
  </section>
</template>

<script>
import { Container, Draggable } from "vue3-smooth-dnd";
// import Container from 'C:/dev/vue3-smooth-dnd/packages/lib/src/components/Container.js'
// import Draggable from 'C:/dev/vue3-smooth-dnd/packages/lib/src/components/Draggable.js'
import { utilService } from "../services/util.service";
import boardGroup from "../components/board-group.vue";
import groupAdd from "../components/group-add.vue";
import boardHeader from "../components/board-header.vue";
import taskPreview from "../components/task-preview.vue";

export default {
  name: "board-details",
  data() {
    return {
      isAddingGroup: true,
      labelsOpen: false,
      loadDate: false,
    };
  },
  components: {
    boardGroup,
    groupAdd,
    Container,
    Draggable,
    boardHeader,
    taskPreview,
  },
  async mounted() {
    await this.loadBoard()
  },
  unmounted() {
    document.body.style = `
   background: none;`;
  },
  computed: {
    board() {
      return this.$store.getters.currBoard;
    },
    unfilteredBoard() {
      return this.$store.state.boardStore.currBoard;
    },
  },
  methods: {
    async starBoard(star) {
      const board = this.$store.getters.currBoard;
      board.star = star;
      await this.$store.dispatch({ type: "saveCurrBoard", boardToSave: board });
    },
    async saveTask(taskToSave, groupId) {
      // console.log(taskToSave, groupIdx);
      const board = await this.$store.dispatch({
        type: "saveTask",
        groupId,
        taskToSave,
      });
    },
    async removeGroup(group) {
      await this.$store.dispatch({ type: "removeGroup", group });
    },
    async removeTask(task, group) {
      await this.$store.dispatch({
        type: "removeTask",
        groupId: group.id,
        taskId: task.id,
      });
    },
    async updateGroup(groupToSave) {
      if (!this.isAddingGroup) this.isAddingGroup = true;
      if (!groupToSave.title) return;
      await this.$store.dispatch({
        type: "updateGroup",
        groupToSave,
      });
    },
    async loadBoard() {
      const { boardId } = this.$route.params;
      await this.$store.dispatch({
        type: "loadCurrBoard",
        boardId,
      });
      if (!this.board.style) return ;
      document.body.style = `
    background-image: url(${this.board.style.bg});
    background-color: ${this.board.style.bg};`;
    },
    async onColumnDrop(dropResult) {
      const scene = Object.assign({}, this.board);
      console.log(scene);
      dropResult.payload = {};
      dropResult.payload.data = this.board.groups[dropResult.removedIndex];
      dropResult.payload.id = this.board.groups[dropResult.removedIndex].id;
      console.log("drop>>", dropResult);
      scene.groups = utilService.applyDrag(scene.groups, dropResult);
      await this.$store.dispatch({
        type: "saveCurrBoard",
        boardToSave: scene,
      });
    },
    getCardPayload(groupId) {
      return (index) => {
        return this.board.groups.filter((p) => p.id === groupId)[0].tasks[
          index
        ];
      };
    },
    async onCardDrop(groupId, dropResult) {
      console.log(dropResult);
      // check if element where ADDED or REMOVED in current collumn
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const scene = Object.assign({}, this.board);
        const column = scene.groups.filter((p) => p.id === groupId)[0];
        const itemIndex = scene.groups.indexOf(column);
        const newColumn = Object.assign({}, column);

        // check if element was ADDED in current column
        // if (dropResult.removedIndex == null && dropResult.addedIndex >= 0) {
          // your action / api call
          // dropResult.payload.loading = true
          // simulate api call
          // setTimeout(function(){ dropResult.payload.loading = false }, (Math.random() * 5000) + 1000);
        // }

        newColumn.tasks = utilService.applyDrag(newColumn.tasks, dropResult);
        scene.groups.splice(itemIndex, 1, newColumn);
        await this.$store.dispatch({
          type: "saveCurrBoard",
          boardToSave: scene,
        });
      }
    },
     //This function is actually a patch for a bug in the smooth-dnd lib. 
     //Without this scrolling is disabled in touch devices after every touch 
     //on a draggable, untill user taps outside the draggable.
    enableScroll(ev){  
      console.log('ev is', ev)
      window.document.body.classList.remove('smooth-dnd-no-user-select', 'smooth-dnd-disable-touch-action')
    },
    goToDetail(group, task) {
      this.$router.push(`/board/${this.board._id}/task/${group.id}/${task.id}`);
    },
  },
  watch: {
    "$route.params.boardId"(id) {
      if (!id) return;
      console.error("Changed to", id);
      this.loadBoard();
      {
        immediate: true;
      }
    },
  },
};
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