import { Vue, store, i18n, LocaleMixin } from './bootstrap.mixin'
import App from './App.mobile'
import router from './router/router.mobile'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

Vue.http.interceptors.push((request, next) => {
  if (request.url !== '/api/login/post') {
    let token = window.localStorage.getItem('token')
    request.headers.set('token', token)
  }

  next(response => {
    if ((response.status === 404) || (response.status === 504)) {
      router.push({
        name: 'Home'
      })
    }
  })
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.userOnly)) {
    /**
     * @see {@link https://stackoverflow.com/questions/10730362/get-cookie-by-name#answer-40786371}
     * @param name
     * @returns {string}
     */
    const getCookie = name => {
      let a = `; ${document.cookie}`.match(`;\\s*${name}=([^;]+)`)
      return a ? a[1] : ''
    }

    if (getCookie('user')) {
      next()
    } else {
      router.push({
        name: 'Login'
      })
    }
  } else next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  mixins: [LocaleMixin],
  components: {
    App
  }
})
