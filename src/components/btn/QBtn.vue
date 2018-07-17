<template>
    <button
            v-ripple.mat="!isDisabled"
            @click="click"
            class="q-btn row inline flex-center q-focusable q-hoverable relative-position"
            :class="classes"
    >
        <div class="desktop-only q-focus-helper"></div>

        <div
                v-if="isLoading && hasPercentage"
                class="q-btn-progress absolute-full"
                :class="{'q-btn-dark-progress': darkPercentage}"
                :style="{width: width}"
        ></div>

        <span class="q-btn-inner row col flex-center">
            <slot v-if="isLoading" name="loading">
                <q-spinner></q-spinner>
            </slot>

            <template v-else>
                <div class="count" :class="countClasses" v-if="count > 0">
                    <span>{{count}}</span>
                </div>
                <q-icon v-if="icon" :name="icon" :class="{'on-left': !round}"></q-icon>
                <slot></slot>
                <q-icon v-if="!round && iconRight" :name="iconRight" class="on-right"></q-icon>
            </template>
        </span>
    </button>
</template>

<script>
    import Ripple from '../../directives/ripple'
    import {QIcon} from '../icon'
    import {QSpinner} from '../spinner'
    import {between} from '../../utils/format'

    export default {
        name: 'q-btn',
        components: {
            QSpinner,
            QIcon
        },
        directives: {
            Ripple
        },
        props: {
            value: Boolean,
            disable: Boolean,
            noCaps: {
                type: Boolean,
                default: false
            },
            icon: String,
            iconRight: String,
            round: Boolean,
            outline: Boolean,
            flat: Boolean,
            rounded: Boolean,
            push: Boolean,
            mini: Boolean,
            small: Boolean,
            big: Boolean,
            color: String,
            glossy: Boolean,

            loader: Boolean,
            percentage: Number,
            darkPercentage: Boolean,
            count:{
                type: [Number, Boolean],
                default: 0,
            }
        },
        data:()=>({
            _loading: false,
        }),
        watch:{
            value(val){
                this.$set(this._data, '_loading', val)
            }
        },
        computed: {
            isLoading(){
                return this.value
            },
            size() {
                if(this.mini){
                  return 'q-btn-mini'
                }
                return `q-btn-${this.small ? 'small' : (this.big ? 'big' : 'standard')}`
            },
            shape() {
                return `q-btn-${this.round ? 'round' : 'rectangle'}`
            },
            hasPercentage() {
                return this.percentage !== void 0
            },
            width() {
                return `${between(this.percentage, 0, 100)}%`
            },
            isDisabled() {
                return this.disable || this.isLoading
            },
            classes() {
                const cls = [this.shape, this.size]

                if (this.flat) {
                    cls.push('q-btn-flat')
                }
                else if (this.outline) {
                    cls.push('q-btn-outline')
                }
                else if (this.push) {
                    cls.push('q-btn-push')
                }

                this.isDisabled && cls.push('disabled')
                this.noCaps && cls.push('q-btn-no-uppercase')
                this.rounded && cls.push('q-btn-rounded')
                this.glossy && cls.push('glossy')

                if (this.color) {
                    if (this.flat || this.outline) {
                        cls.push(`text-${this.color}`)
                    }
                    else {
                        cls.push(`bg-${this.color}`)
                        if(this.color == 'light'){
                            cls.push('text-dark')
                        }else{
                            cls.push(`text-white`)
                        }
                    }
                }

                return cls
            },
            countClasses(){
                let cls = []
                if(this.color){

                    if (this.flat || this.outline) {
                        cls.push(`text-${this.color}`)
                    }
                    else {
                        cls.push(`text-${this.color}`)
                        if(this.color == 'light'){
                            cls.push('bg-dark')
                        }else{
                            cls.push(`bg-white`)
                        }

                    }
                }
                return cls
            }
        },
        methods: {
            click(e) {
                this.$el.blur()

                if (this.isDisabled) {
                    return
                }
                if (this.loader !== false || this.$slots.loading) {
                    this._data._loading = true
                    this.$emit('input', true)
                }
                this.$emit('click', e, () => {
                    this._data._loading = false
                    this.$emit('input', false)
                })
            }
        }
    }
</script>
