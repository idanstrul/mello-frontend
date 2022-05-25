<template>
    <section class="date-edit">
            <Datepicker
            AutoApply
            v-model="taskDate"
            @update:modelValue="test"
            utc inline
            :startTime="{}"
            :monthChangeOnScroll="false"
            weekStart="0"
            monthNameFormat="long">
                 <template #action-select>
                    <button class="btn-save-date" @click="selectDate">Save</button>
                </template>
            </Datepicker>
        <!-- <p class="secondary-section-title">Start date</p> -->
            <p class="date-title">Due date</p>

        <!-- <el-calendar v-model="currTaskDates.startDate" /> -->
        <!-- <el-date-picker
            v-model="value3"
            type="datetime"
            placeholder="Pick a Date"
            format="YYYY/MM/DD hh:mm:ss"
            value-format="x"
        /> -->
        <pre>{{ taskDate }}</pre>

        <!-- <span class="secondary-section-title">Due date</span>
        <el-time-select v-model="currTaskDates.endTime" step="00:15" placeholder="Select time" />
        <select>
            <option value>(none)</option>
            <optgroup v-for="task in checklists" :key="task.taskId" :label="task.taskTitle">
                <option
                    v-for="checklist in task.checklists"
                    :key="checklist.id"
                    :value="checklist.id"
                >{{ checklist.title }}</option>
            </optgroup>
        </select>
        <button class="primary-btn">Add</button> -->
    </section>
</template>

<script>

  import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: 'date-edit',
    props: {
        currTask: Object,
    },
    components: { Datepicker },
    data() {
        return {
            startDate: null,
            dueDate: null,
            taskDate: null,
            currTaskDates: {
                startDate: null,
                endDate: null,
                endTime: null,
                date: null
            }
        }
    },
    computed: {
        taskToEdit() {
            return JSON.parse(JSON.stringify(this.currTask))
        }

    },
    methods:{
        selectDate(){
            var elDate = document.querySelector('.dp__selection_preview')
            // elDate = elDate.querySelectorAll('div')
            // this.startDate = Date.now(elDate[0]?.innerText)
            // this.dueDate = Date.now(elDate.innerText)
            // if(this.startDate === this.dueDate) this.startDate = null 
            // var date = Date.parse(elDate.innerText.split(' ')[0].split(',')[0])
            var date = Date.parse(elDate.innerText)
            this.taskToEdit.dueDate = date
            // var time = (elDate.innerText.split(' ')[1])
            // console.log(Date.parse(date));
            console.log(this.taskToEdit);
        if (this.dueDate - Date.now() < 0){
          this.taskToEdit.status = 'over-due'
        } 
      if (this.dueDate - Date.now() < 86400 * 1000) {
          // console.log(this.task.title);
        this.taskToEdit.status = 'due-soon'
      }
          if (this.dueDate - Date.now() > 86400 * 1000){
            // console.log('hi');
            this.taskToEdit.status = 'in-progress'
          } 
            this.$emit('taskUpdated', this.taskToEdit)

            // console.log((elDate.innerText.split(' ')[0]));

            // console.log(this.$refs.date.selectDate());
        },
        test(){
            console.log(modelValue);
            // console.log(p);
        }
    },
}
</script>

<style>
</style>


