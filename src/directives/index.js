// import vClickOutside from 'v-click-outside'

export const focusDirective = {
    mounted: (el) => {
        el.focus()
    }
}

export const clickOutside ={
        mounted: (el, binding, vnode) => {
            // assign event to the element
            el.clickOutsideEvent = function (event) {
              // console.log('el.getBoundingClientRect()', el.getBoundingClientRect())
              // console.log('event.clientX', event.clientX)
              // console.log('event.clientY', event.clientY)
              const elArea = el.getBoundingClientRect()
              if ((event.clientX < elArea.x ||
                 event.clientX > elArea.x + elArea.width ||
                  event.clientY < elArea.y ||
                  event.clientY > elArea.y + elArea.height) &&
                  // here we check if the click event is outside the element and it's children
                   !(el == event.target || el.contains(event.target))){
                    // if clicked outside, call the provided method
                    console.log('clicked outside!', el);
                    binding.value(event)
                }
            }

            const startListening = function () {
              document.body.removeEventListener('click', startListening)
              document.body.removeEventListener('touchstart', startListening)
              document.body.addEventListener('click', el.clickOutsideEvent)
              document.body.addEventListener('touchstart', el.clickOutsideEvent)
            }

            document.body.addEventListener('click', startListening)
            document.body.addEventListener('touchstart', startListening)
            // console.log('v-click-outside', vnode);
            // register click and touch events
            // setTimeout(() => {
            //   document.body.addEventListener('click', el.clickOutsideEvent)
            //   document.body.addEventListener('touchstart', el.clickOutsideEvent)
            // }, 500)
        },
        unmounted: function (el) {
      // unregister click and touch events before the element is unmounted
          // console.log('puki',el.clickOutsideEvent );
          document.body.removeEventListener('click', el.clickOutsideEvent)
          document.body.removeEventListener('touchstart', el.clickOutsideEvent)
        },
      //   beforeUnmount: function (el) {
      // // unregister click and touch events before the element is unmounted
      //     // console.log('puki',el.clickOutsideEvent );
      //     document.body.removeEventListener('click', el.clickOutsideEvent)
      //     document.body.removeEventListener('touchstart', el.clickOutsideEvent)
      //   },
        stopProp(event) {
          event.stopPropagation()
        },
      }
     
     
//      <group-menu
//            v-if="showGroupMenu"
//            v-clickoutside="hidePopup"
     
     
     
//      hidePopup() {
//            this.showGroupMenu = false;
//          },
// }

// export const clickOutside = {

// }