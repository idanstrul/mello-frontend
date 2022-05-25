<template>
    <section 
    class="trello-txt-input" 
    v-clickoutside="handleClickOutside" 
    @click="openEdit">
    </section>
    
    <section
        v-clickoutside="closeModal"
        class="main-edit-modal"
        :style="{ 'top': posCorrected.y + 'px', 'left': posCorrected.x + 'px' }"
        ref="elModal">
    </section>
    
    <div 
    v-clickoutside="closeModal" 
    class="modal-container flex column center">
    </div>
</template>

<script>
export default {
    directives: {
        clickOutside: {
            mounted: (el, binding) => {
                // assign event to the element
                el.clickOutsideEvent = function (event) {

                    // here we check if the click event is outside the element and it's children
                    const elArea = el.getBoundingClientRect()
                    if ((event.clientX < elArea.x ||
                        event.clientX > elArea.x + elArea.width ||
                        event.clientY < elArea.y ||
                        event.clientY > elArea.y + elArea.height) &&
                        !(el == event.target || el.contains(event.target))) {
                        // if clicked outside, call the provided method
                        binding.value(event)
                    }
                }

                // register click and touch events
                const startListening = function () {
                    document.body.removeEventListener('click', startListening)
                    document.body.removeEventListener('touchstart', startListening)
                    document.body.addEventListener('click', el.clickOutsideEvent)
                    document.body.addEventListener('touchstart', el.clickOutsideEvent)
                }

                document.body.addEventListener('click', startListening)
                document.body.addEventListener('touchstart', startListening)
            },
            unmounted: function (el) {
                // unregister click and touch events before the element is unmounted
                document.body.removeEventListener('click', el.clickOutsideEvent)
                document.body.removeEventListener('touchstart', el.clickOutsideEvent)
            },
            stopProp(event) {
                event.stopPropagation()
            },
        }
    }
}
</script>

<style>
</style>