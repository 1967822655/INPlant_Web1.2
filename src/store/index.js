import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function createStore() {
    return new Vuex.Store({
        state: {
            loginIndex: 'LoginBox',
            chooseDevice: 'null',
            username: 'null'
        },
        mutations: {
            updateLoginIndex (state, val) {
                state.loginIndex = val
            },
            updateUsername (state, val) {
                state.username = val
            },
            updateChooseDevice (state, val) {
                state.chooseDevice = val
            }
        },
        actions: {
        },
        modules: {
        }
    })
}
