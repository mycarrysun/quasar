<template>
    <router-link
            :tag="tag"
            :to="to"
            :exact="exact"
            :append="append"
            :replace="replace"
            :event="routerLinkEventName"
            :class="classes"
            v-ripple.mat
            @click.native="trigger"
    >
        <slot></slot>
    </router-link>
</template>

<script>
  import { routerLinkEvent, RouterLinkMixin } from '../../utils/router-link'
  import { itemClasses, ItemMixin } from '../list/list-utils'
  import Ripple from '../../directives/ripple'

  export default {
    name: 'q-side-link',
    directives: {
      Ripple
    },
    mixins: [RouterLinkMixin, ItemMixin],
    props: {
      item: Boolean
    },
    inject: {
      layout: {
        default: null
      }
    },
    computed: {
      classes () {
        this.link = true
        return this.item ? itemClasses(this) : 'relative-position'
      }
    },
    methods: {
      trigger () {
        console.log('Hiding current side menu')
        this.layout.hideCurrentSide(() => {
          console.log('Dispatching router link event')
          this.$el.dispatchEvent(routerLinkEvent)
        })
      }
    }
  }
</script>
