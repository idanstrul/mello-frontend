<template>
    <section
        v-clickoutside="closeModal"
        class="main-edit-modal"
        :style="{ 'top': posCorrected.y + 'px', 'left': posCorrected.x + 'px' }"
        ref="elModal"
    >
        <!-- v-clickoutside="closeModal" -->
        <header class="edit-modal-header">
            <span class="modal-header-title">{{ modalTitle }}</span>
            <button class="exit-btn" @click="closeModal"></button>
        </header>
        <main class="edit-modal-main" :style="{ 'max-height': maxHeight + 'px' }">
            <slot></slot>
        </main>
        <!-- <pre>{{ position }}</pre> -->
    </section>
</template>

<script>
export default {
    name: 'main-edit-modal',
    props: {
        modalTitle: String,
        pos: Object,
    },
    mounted() {
        // console.error('this.$refs.elModal.getBoundingClientRect()', this.$refs.elModal.getBoundingClientRect());
        // console.log('this.$refs.elModal', this.$refs.elModal);
        console.log('Main edit modal is mounted!');
        // this.$refs.elModal.onload = () => {
        // setTimeout(() => {
        // this.correctPosition()
        const resizeObserver = new ResizeObserver(() => {
            // console.error('resize obsereved')
            this.correctPosition()
        });
        resizeObserver.observe(this.$refs.elModal);

        // }, 50)

        // }
        // console.log('this.posCorrected',this.posCorrected);
        this.$emit('mounted')
    },
    data() {
        return {
            posCorrected: (this.pos)? JSON.parse(JSON.stringify(this.pos)): {x: 0, y: 0},
            maxHeight: (window.innerHeight || document.documentElement.clientHeight)
        }
    },
    methods: {
        closeModal() {
            this.$emit('editModalClosed')
            // this.$store.commit({type: 'toggleEditModal', isOpen: false, editType: ''})
        },
        correctPosition() {
            if (!this.$refs.elModal || !this.pos) return
            const pos = JSON.parse(JSON.stringify(this.pos))
            const elArea = this.$refs.elModal.getBoundingClientRect()
            const viewPortSize = {
                h: (window.innerHeight || document.documentElement.clientHeight),
                w: (window.innerWidth || document.documentElement.clientWidth)
            }

            if (pos.x < 0) pos.x = 20
            if (pos.x + elArea.width > viewPortSize.w) {
                // console.log('is out from right!', elArea.right, viewPortSize.w);
                pos.x = viewPortSize.w - elArea.width - 20
                // console.log('is out from right!', elArea.right, viewPortSize.w);
            }

            this.maxHeight = viewPortSize.h
            // setTimeout(() =>
            // console.error('elArea.height', this.$refs.elModal.getBoundingClientRect().height), 2000
            // )
            // console.error('pos.y + elArea.height', pos.y + elArea.height)
            // console.error('viewPortSize.h', viewPortSize.h)

            if (pos.y + elArea.height > viewPortSize.h) {
                pos.y = viewPortSize.h - elArea.height - 20
                // console.error('Larger then view port!')
            }
            // console.log('pos.y', pos.y);

            if (pos.y < 20) {
                // console.error('Less then 20 from top')
                pos.y = 20
                this.maxHeight = viewPortSize.h - 80
            }
            // console.log('this.maxHeight', this.maxHeight);

            this.posCorrected = pos
            // console.error('this.posCorrected', this.posCorrected)
        }
    },
    computed: {
        position() {
            return this.$refs.elModal
        },
        elheight() {
            if (!this.$refs.elModal) return
            // console.error('this.$refs.elModal.getBoundingClientRect().height', this.$refs.elModal.getBoundingClientRect().height)
            return this.$refs.elModal.getBoundingClientRect().height
        }
    },
    watch: {

    },
    unmounted() {
        console.log('main edit modal is unmounted');
        this.$emit('unmounted')
    }

}
</script>

<style>
</style>