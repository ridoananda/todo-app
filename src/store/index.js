import { createStore } from "vuex";

const store = createStore({
    state: ()=> ({
        lists: JSON.parse(localStorage.getItem('todo-app__lists')) || [],
        colors: ['#C4C4C4', '#9B51E0', '#27AE60', '#F2F2F2', '#2D9CDB', '#2F80ED', '#EB5757'],
    }),
    mutations: {
        UPDATE_LIST(state, data){
            state.lists[data.index] = data.item
            localStorage.setItem('todo-app__lists', JSON.stringify(state.lists))
        },
        DELETE_LIST(state, index){
            state.lists.splice(index, 1)
            localStorage.setItem('todo-app__lists', JSON.stringify(state.lists))
        },
        PUSH_LIST(state, list){
            state.lists.unshift(list)
            localStorage.setItem('todo-app__lists', JSON.stringify(state.lists))
        },
        SET_FINISH_LIST(state, i){
            state.lists[i].isFinished = state.lists[i].isFinished ? false : true
            localStorage.setItem('todo-app__lists', JSON.stringify(state.lists))
        }
    },
    actions: {
        listSave({ commit }, list){
            commit('PUSH_LIST', list)
        },
        listRemove({ commit }, index){
            commit('DELETE_LIST', index)
        },
        listUpdate({ commit }, lists){
            commit('SET_LIST', lists)
        }
    }
})

export default store