import axios from 'axios';

export default {
  namespaced: true,

  state: {
    token: null,
    user: null
  },

  getters: {
    authenticated(state) {
      return state.token && state.user;
    },
    user(state) {
      return state.user;
    }
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token= token
    },
    SET_USER(state, data) {
      state.user= data
    }
  },

  actions: {
    async signIn({ dispatch }, credentials) {
      let response= await axios.post('/api/auth/signin', credentials)
      return dispatch('attempt', response.data);
    },

    async attempt({ commit, state }, data) {
      // commit('SET_TOKEN', data.token);
      if(data) {
        commit('SET_TOKEN', data.token);
      }
      if(!state.token) {
        return
      }
      try {
        commit('SET_USER', data);
      } catch(e) {
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
      }
    },

    signOut({ commit }) {
      return axios.post('auth/logout').then(()=> {
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
      })
    }

  }

}
