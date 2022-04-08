import TabMixin from './tab-mixin'

export default {
  name: 'q-tab',
  mixins: [TabMixin],
  props: {
    default: Boolean
  },
  methods: {
    select () {
      this.$emit('click', this.name)
      if (!this.disable) {
        this.selectTab(this.name)
      }
    }
  },
  mounted () {
    if (this.default && !this.disable) {
      this.select()
    }
  },
  render (h) {
    return h('div', {
      attrs: {
        'aria-label': this.label,
        role: 'tab',
        'aria-selected': this.active
      },
      staticClass: 'q-tab column flex-center relative-position',
      'class': this.classes,
      on: {
        click: this.select
      },
      directives: [{
        name: 'ripple',
        modifiers: {
          mat: true
        }
      }]
    }, this.__getTabContent(h))
  }
}
