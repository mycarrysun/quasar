import './polyfills'
import { version } from '../package.json'
import Platform, { isSSR } from './plugins/platform'
import History from './history'
import I18n from './i18n'
import Body from './body'
import Icons from './icons'

export const queues = {
  server: [], // on SSR update
  takeover: [] // on client takeover
}

export const $q = {
  version,
  theme: process.env.THEME
}

export default function (Vue, opts = {}) {
  if (this.__installed) { return }
  this.__installed = true

  const cfg = opts.config || {}

  // required plugins
  Platform.install({ $q, Vue, queues })
  Body.install({ $q, queues, cfg })
  History.install({ $q, cfg })
  I18n.install({ $q, Vue, queues, cfg, lang: opts.i18n })
  Icons.install({ $q, Vue, queues, iconSet: opts.iconSet })

  if (isSSR) {
    Vue.mixin({
      beforeCreate () {
        this.$q = this.$root.$options.$q
      }
    })
  }
  else {
    Vue.prototype.$q = $q
  }

  if (opts.directives) {
    Object.keys(opts.directives).forEach(key => {
      const d = opts.directives[key]
      if (d.name !== undefined && d.unbind !== void 0) {
        Vue.directive(d.name, d)
      }
    })
  }

  if (opts.components) {
    Object.keys(opts.components).forEach(key => {
      const c = opts.components[key]
      if (c.name !== undefined && (c.render !== void 0 || c.mixins !== void 0)) {
        Vue.component(c.name, c)
      }
    })
  }

  if (opts.plugins) {
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function' && p !== Platform) {
        p.install({ $q, Vue, queues, cfg })
      }
    })
  }
}
