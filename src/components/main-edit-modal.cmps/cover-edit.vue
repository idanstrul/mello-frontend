<template>
    <section class="cover-edit">
       <h4>Size</h4>
       <div class="flex center align-center">
        <label>
        <input @click="setCoverSize('small')" :checked="currTask.style && currTask.style.size=='small'" type="radio" name="cover-opt">  
        <div class="cover-opt small"> 
            <div  class="cover-opt-header" :style="getBg" ></div>
                <div class="cover-opt-lines" :class="getLine">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="cube"></div>
                    <div class="cube"></div>
                    <div class="circle"></div>
                </div> 
        </div>
        </label>
        <label>
        <input @click="setCoverSize('big')" :checked="currTask.style && currTask.style.size=='big'" type="radio" name="cover-opt" value="true">
        <div class="cover-opt big">
            <div :style="getBg" class="big-container">
            <div class="cover-opt-lines" :class="getLine">
        <div class="line"></div>
        <div class="line"></div>
        </div>
        </div>
        </div>
        
        </label>
        </div>
        <button @click="removeCover" v-if="currTask.style" class="btn-remove-cover">Remove cover</button>
        <h4>Colors</h4>
        <div class="btn-cover-container flex center wrap">
            <label @click="setCoverClr('#7BC86C')">
            <input :checked="currTask.style && currTask.style.bg=='#7BC86C'" type="radio" name="btn-clr">
            <div class="btn-clr green"></div>
            </label>
            <label  @click="setCoverClr('#f5dd29')">
            <input :checked="currTask.style && currTask.style.bg=='#f5dd29'" type="radio" name="btn-clr">
            <div class="btn-clr yellow"></div>
            </label>
            <label @click="setCoverClr('#FFAF3F')">
            <input :checked="currTask.style && currTask.style.bg=='#FFAF3F'" type="radio" name="btn-clr">
            <div class="btn-clr orange"></div>
            </label>
            <label  @click="setCoverClr('#EF7564')">
            <input :checked="currTask.style && currTask.style.bg=='#EF7564'" type="radio" name="btn-clr">
            <div class="btn-clr red"></div>
            </label>
            <label  @click="setCoverClr('#CD8DE5')">
            <input :checked="currTask.style && currTask.style.bg=='#CD8DE5'" type="radio" name="btn-clr">
            <div class="btn-clr purple"></div>
            </label>
            <label  @click="setCoverClr('#5BA4CF')">
            <input :checked="currTask.style && currTask.style.bg=='#5BA4CF'" type="radio" name="btn-clr">
            <div class="btn-clr blue"></div>
            </label>
            <label  @click="setCoverClr('#29CCE5')">
            <input :checked="currTask.style && currTask.style.bg=='#29CCE5'" type="radio" name="btn-clr">
            <div class="btn-clr lightblue"></div>
            </label>
            <label  @click="setCoverClr('#6DECA9')">
            <input :checked="currTask.style && currTask.style.bg=='#6DECA9'" type="radio" name="btn-clr">
            <div class="btn-clr turquoise"></div>
            </label>
            <label  @click="setCoverClr('#FF8ED4')">
            <input :checked="currTask.style && currTask.style.bg=='#FF8ED4'" type="radio" name="btn-clr">
            <div class="btn-clr pink"></div>
            </label>
            <label @click="setCoverClr('#172B4D')">
            <input :checked="currTask.style && currTask.style.bg=='#172B4D'" type="radio" name="btn-clr">
            <div class="btn-clr navy"></div>
            </label>
        </div>
        <h4>Attachments</h4>
        <div v-if="currTask.attachments" class="btn-cover-container img-container flex wrap">
        <label v-for="a in currTask.attachments" :key="a.asset_id" @click="setCoverImg(a.secure_url)">
            <input :checked="currTask.style && currTask.style.bg==a.secure_url" type="radio" name="btn-clr">
            <div class="btn-clr cover-opt-img"><img class="cover-opt-img" :src="a.secure_url" alt=""></div>
        </label>
        </div>
        <label class="btn-upload-cover" v-if="currStatus.isWaiting || !currStatus.isLoading">
            Upload a cover image
        <input type="file" class="attach" @change="onUpload">
        </label>

        <div v-if="currStatus.isLoading">
            <img :src="'../../../../src/assets/' + currStatus.imgName" />
            <span>{{ currStatus.txt }}</span>
        </div>
        <button @click.stop="openSearch" class="btn-search-photo">Search for photos</button>

       
        <!-- <button class="btn-upload-cover">Upload a cover image</button> -->
            <!-- <div class="cover-opt">
             

            </div>
            <div class="cover-opt">
                <div>

                </div>
            </div>
       </div> -->
    </section>
</template>

<script>
// import { json } from "stream/consumers";
import { uploadImg } from "../../services/imgUpload.service";


export default {
    name: 'cover-edit',
    props: {
        currTask: Object,
    },
    data(){
        return {
            currStatus: null,
            statusOptions: {
                waiting: {
                    imgName: "Upload-PNG-Image-File.png",
                    txt: "Upload file",
                    isWaiting: true
                },
                loading: {
                    imgName: "loader.gif",
                    txt: 'Loading...',
                    isLoading: true
                },
                complete: {
                    imgName: "checkmark-cut.gif",
                    txt: 'Attachment added successfuly!'
                },
                failed: {
                    imgName: "ezgif.com-gif-maker.gif",
                    txt: 'OOPS! File upload failed!'
                }
            }        
        } 
    },
    created(){
        this.currStatus = this.statusOptions.waiting
    },
    methods: {
        openSearch(){
            // debugger
            this.$emit('openSearch')
        },
        async onUpload(ev) {
            console.log('ev.target.files[0]', ev.target.files[0]);
            this.currStatus = this.statusOptions.loading;
            try {
                const attachment = await uploadImg(ev)
                console.log(attachment);
                if (!this.taskToEdit.attachments) this.taskToEdit.attachments = [];
                this.taskToEdit.attachments.push(attachment)
                console.log('this.taskToEdit', this.taskToEdit);
                this.$emit('taskUpdated', this.taskToEdit)
                this.currStatus = this.statusOptions.complete
            } catch (err) {
                this.currStatus = this.statusOptions.failed
            }
            // setTimeout(this.closeModal, 2000)
        },
        setCoverClr(clr){
           console.log(this.taskToEdit);
            if(!this.taskToEdit.style) this.taskToEdit.style = {}
            this.taskToEdit.style.bg = clr 
            if(!this.taskToEdit.style.size) this.taskToEdit.style.size = 'small'
            this.$emit('taskUpdated', this.taskToEdit)
            // console.log(this.currTask);
       },
        setCoverImg(pic){
        //    console.log(this.taskToEdit);
            if(!this.taskToEdit.style) this.taskToEdit.style = {}
            this.taskToEdit.style.bg = pic
            if(!this.taskToEdit.style.size) this.taskToEdit.style.size = 'big'
            this.$emit('taskUpdated', this.taskToEdit)
            console.log(this.currTask);
       },
       setCoverSize(size){
           console.log(this.taskToEdit);
            if(!this.taskToEdit.style) this.taskToEdit.style = {}
            this.taskToEdit.style.size = size 
            if(!this.taskToEdit.style.bg) this.taskToEdit.style.bg = '#7BC86C'
            this.$emit('taskUpdated', this.taskToEdit)
       },
       removeCover(){
           delete this.taskToEdit.style
           console.log(this.taskToEdit);
            this.$emit('taskUpdated', this.taskToEdit)
       },

    },
    computed: {
        getBg(){
            // if
            var bg = JSON.parse(JSON.stringify(this.currTask))
            if(!bg.style){
            bg.style = {}
            bg.style.bg = ''
            }
            // console.log(this.taskToEdit.style.bg);
            if(bg.style.bg){
                console.log(bg.style);
                if(bg.style.bg.split('')[0] === '#')
                return `background-color: ${bg.style.bg}; opacity:1`
                else return `background-image: url('${bg.style.bg}'); opacity:1; background-color:transparent;`
            }
            // return `background-color: ${bg.style.bg}`
            //  return `background-color: ${this.taskToEdit.style.bg}` 
            // return {'background-color': this.taskToEdit.style.bg}
            // return `background-color: ${this.taskToEdit.style.bg}; position: absolute`
        },
        getLine(){
            // console.log(this.currTask);
            if(!this.currTask.style) return
            else return 'colorized'
        },
        
        taskToEdit() {
            const task = JSON.parse(JSON.stringify(this.currTask))
            // if(!task.style) task.style = {}
            // task.style.bg = ''
            return task
        },
    },
    components: {
    }
}
</script>

<style>
</style>