import { createStore } from "vuex";
import { userStore } from "./modules/user.store.js";
import { boardStore } from "./modules/board.store.js";

const store = createStore({
    strict: true,
    state: {
        editModalStatus:{
            isOpen: false,
            editType: '',
            currTask: null,
            parentGroupId: ''
        },
        isLoading: false,
        userMsg: {
            msg: '',
            style: '',
            isAlive: false
        }
    },
    getters: {
        editModalStatus(state){
            return JSON.parse(JSON.stringify(state.editModalStatus))
        },
        isLoading(state) {
            return JSON.parse(JSON.stringify(state.isLoading))
        },
        userMsg(state) {
            return state.userMsg
        }
    },
    mutations: {
        toggleEditModal(state, {isOpen, editType, currTask, parentGroupId }){
            state.editModalStatus = {
                isOpen,
                editType,
                currTask,
                parentGroupId
            }
        },
        setIsLoading(state, { loadingStatus }) {
            state.isLoading = loadingStatus
        },
        setUserMsg(state, { msg, style, isAlive }) {
            state.userMsg = {
                msg,
                style,
                isAlive
            }
        },
        setMsg(state, { msg }) {
            state.userMsg = msg;
        },
    },
    actions: {
        flashUserMsg(context, { msg, style }) {
            context.commit({ type: 'setUserMsg', msg, style, isAlive: true })
            setTimeout(() => {
                context.commit({ type: 'setUserMsg', msg: '', style: '', isAlive: false })
            }, 2000)
        },
        async showMsg({ state, commit }, { msg }) {
            try {
                if (state.setTimeId) clearTimeout(state.setTimeId);
                commit({ type: 'setMsg', msg });
                msg = {
                    txt: '',
                    type: ''
                }
                state.setTimeId = setTimeout(() => {
                    commit({ type: 'setMsg', msg });
                    clearTimeout(state.setTimeId)
                }, 2500)
            } catch (err) {
                console.log('ERROR: cannot get userMsg', err);
            }
        }
    },

    modules: {
        userStore,
        boardStore
    }
})

export default store