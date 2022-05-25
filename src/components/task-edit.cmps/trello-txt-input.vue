<template>
    <section class="trello-txt-input" v-clickoutside="handleClickOutside" @click="openEdit">
        <div v-if="!isInEdit" class="flex space-between">
            <span class="input-title">{{ txtToShow }}</span>
            <slot></slot>
        </div>
        <div v-else class="input-edit">
            <textarea
                cols="30"
                rows="3"
                @keydown.enter.prevent="next"
                @keydown.esc="cancel"
                v-model="updatedTxt"
                :placeholder="placeholder"
                v-focus
            ></textarea>
            <!-- <pre>{{updatedTxt}}</pre> -->
            <div class="controlls">
                <button class="primary-btn" @click="saveTxt">Save</button>
                <button class="cancel-btn" @click="cancel"></button>
                <slot name="edit-controlls"></slot>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'trello-txt-input',
    props: {
        txt: String,
        placeholder: {
            type: String,
            default: ''
        },
        denyEmptySave: {
            type: Boolean,
            default: false
        },
        resetOnSave: {
            type: Boolean
        },
        allowNext: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            updatedTxt: this.txt,
            isInEdit: false
        }
    },
    methods: {
        saveTxt() {
            console.log('saving Text!');
            if (!this.updatedTxt) {
                console.log('this.denyEmptySave', this.denyEmptySave);
                if (!this.denyEmptySave) this.isInEdit = false
                return this.$emit('txtIsEmpty', '')
            }
            this.$emit('txtSaved', this.updatedTxt)
            if (this.resetOnSave) this.updatedTxt = '';
            this.isInEdit = false
        },
        openEdit(event) {
            console.log('event.target.tagName', typeof event.target.tagName);
            if (event.target.tagName === 'BUTTON') return
            this.isInEdit = true
        },
        cancel() {
            this.updatedTxt = this.txt
            this.isInEdit = false
        },
        next() {
            this.saveTxt()
            if (!this.isInEdit && this.allowNext) this.isInEdit = true/* $emit('enterClicked') */
        },
        handleClickOutside() {
            if (!this.isInEdit) return
            // this.saveTxt()
            if (!this.updatedTxt) this.cancel()
            else this.saveTxt()
        }
    },
    computed: {
        txtToShow() {
            if (!this.updatedTxt && this.placeholder) return this.placeholder
            return this.updatedTxt
        }
    }
}
</script>

<style>
</style>