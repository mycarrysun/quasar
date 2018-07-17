<template>
    <q-input-frame
            ref="input"
            class="q-select"

            :prefix="prefix"
            :suffix="suffix"
            :stack-label="stackLabel"
            :float-label="floatLabel"
            :error="error"
            :disable="disable"
            :inverted="inverted"
            :dark="dark"
            :before="before"
            :after="after"
            :color="frameColor || color"

            :focused="focused"
            focusable
            :length="length"
            :additional-length="additionalLength"

            @click.native="open"
            @focus.native="__onFocus"
            @blur.native="__onBlur"
            @keydown.native="__handleKeypress"
    >
        <div
                v-if="hasChips"
                class="col row items-center group q-input-chips"
                :class="alignClass"
        >
            <q-chip
                    v-for="{label, value} in selectedOptions"
                    :key="label"
                    small
                    :closable="!disable"
                    :color="color"
                    @click.native.stop
                    @close="__toggle(value)"
            >
                {{ label }}
            </q-chip>
        </div>

        <div
                v-else
                class="col row items-center q-input-target"
                :class="alignClass"
                v-html="actualValue"
        ></div>

        <q-icon slot="after" name="arrow_drop_down" class="q-if-control"></q-icon>

        <q-popover
                ref="popover"
                fit
                :disable="disable"
                :offset="[0, 10]"
                :anchor-click="false"
                class="column no-wrap"
                @open="__onFocus"
                @close="__onClose"
        >
            <q-field-reset>
                <q-search
                        v-if="filter"
                        v-model="terms"
                        @input="reposition"
                        :placeholder="filterPlaceholder"
                        :debounce="100"
                        :color="color"
                        icon="filter_list"
                        class="no-margin"
                        style="min-height: 50px; padding: 10px;"
                        ref="search"
                ></q-search>
            </q-field-reset>

            <q-list
                    link
                    :separator="separator"
                    class="no-border scroll"
            >
                <template v-if="multiple">
                    <q-item-wrapper
                            v-for="opt in visibleOptions"
                            :key="JSON.stringify(opt)"
                            :cfg="opt"
                            slot-replace
                            @click.capture="__toggle(opt.value)"
                    >
                        <q-toggle
                                v-if="toggle"
                                slot="right"
                                :color="color"
                                :value="optModel[opt.index]"
                        ></q-toggle>
                        <q-checkbox
                                v-else
                                slot="left"
                                :color="color"
                                :value="optModel[opt.index]"
                        ></q-checkbox>
                    </q-item-wrapper>
                </template>
                <template v-else>
                    <q-item-wrapper
                            v-for="(opt, index) in visibleOptions"
                            :key="JSON.stringify(opt)"
                            :cfg="opt"
                            slot-replace
                            :active="index === selectedIndex"
                            @click.capture="__select(opt.value)"
                    >
                        <q-radio
                                v-if="radio"
                                :color="color"
                                slot="left"
                                :value="value"
                                :val="opt.value"
                        ></q-radio>
                    </q-item-wrapper>
                </template>
            </q-list>
        </q-popover>
    </q-input-frame>
</template>

<script>
    import {QFieldReset} from '../field'
    import {QSearch} from '../search'
    import {QPopover} from '../popover'
    import {QList, QItemWrapper} from '../list'
    import {QCheckbox} from '../checkbox'
    import {QRadio} from '../radio'
    import {QToggle} from '../toggle'
    import SelectMixin from './select-mixin'
    import clone from '../../utils/clone'
    import {normalizeToInterval} from "../../utils/format";

    function defaultFilterFn(terms, obj) {
        return obj.label.toLowerCase().indexOf(terms) > -1
    }

    function prevent(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    export default {
        name: 'q-select',
        mixins: [SelectMixin],
        components: {
            QFieldReset,
            QSearch,
            QPopover,
            QList,
            QItemWrapper,
            QCheckbox,
            QRadio,
            QToggle
        },
        props: {
            filter: [Function, Boolean],
            filterPlaceholder: {
                type: String,
                default: 'Search'
            },
            radio: Boolean,
            placeholder: String,
            separator: Boolean,
            autofocusFilter: Boolean,
        },
        data:()=>({
            enterKey: false,
            selectedIndex: -1,
        }),
        computed: {
            optModel() {
                if (this.multiple) {
                    return this.options.map(opt => this.value.includes(opt.value))
                }
            },
            visibleOptions() {
                let opts = clone(this.options).map((opt, index) => {
                    opt.index = index
                    opt.value = this.options[index].value
                    return opt
                })
                if (this.filter && this.terms.length) {
                    const lowerTerms = this.terms.toLowerCase()
                    opts = opts.filter(opt => this.filterFn(lowerTerms, opt))
                }
                return opts
            },
            filterFn() {
                return typeof this.filter === 'boolean'
                    ? defaultFilterFn
                    : this.filter
            },
            activeItemSelector() {
                return this.multiple
                    ? `.q-item-side > ${this.toggle ? '.q-toggle' : '.q-checkbox'} > .active`
                    : `.q-item.active`
            }
        },
        methods: {
            open(event) {
                if (!this.disable) {
                    if (this.$refs && this.$refs.popover) {
                        if (this.$q.platform.is.desktop) {
                            this.selectedIndex = 0
                        }
                        this.$refs.popover.open()

                    }
                }
            },
            close() {
                this.$refs.popover.close()
            },
            reposition() {
                const popover = this.$refs.popover
                if (popover.opened) {
                    popover.reposition()
                }
            },

            __onFocus() {
                this.focused = true
                this.$emit('focus')
                const selected = this.$refs.popover.$el.querySelector(this.activeItemSelector)
                if (selected) {
                    selected.scrollIntoView()
                }
                if(this.autofocusFilter){
                    setTimeout(() =>{
                        let el = this.$refs.search.$refs.input.$refs.input
                        if(el){
                            el.focus()
                        }
                    }, 200)
                }
            },
            __onBlur(e) {
                this.__onClose()
                setTimeout(() => {
                    const el = document.activeElement
                    if (el !== document.body && !this.$refs.popover.$el.contains(el)) {
                        this.close()
                    }
                }, 1)
            },
            __onClose() {
                this.focused = false
                this.$emit('blur')
                this.terms = ''
            },
            __select(val) {
                if (this.value !== val) {
                    this.$emit('input', val)
                    this.$emit('change', val)
                }
                this.close()
            },
            setCurrentSelection() {
                this.enterKey = true
                if (this.selectedIndex >= 0) {
                    this.__select(this.visibleOptions[this.selectedIndex].value)
                }
            },
            __handleKeypress(e) {
                switch (e.keyCode || e.which) {
                    case 38: // up
                        this.__moveCursor(-1, e)
                        break
                    case 40: // down
                        this.__moveCursor(1, e)
                        break
                    case 13: // enter
                        this.setCurrentSelection()
                        prevent(e)
                        break
                    case 27: // escape
                        this.__clearSearch()
                        break
                    case 9: //tab
                        this.setCurrentSelection()
                        break

                }
            },
            __moveCursor(offset, e) {
                prevent(e)

                if (!this.$refs.popover.opened) {
                    this.open(e)
                }
                else {
                    this.move(offset)
                }
            },
            move(offset) {
                this.selectedIndex = normalizeToInterval(
                    this.selectedIndex + offset,
                    0,
                    this.options.length - 1
                )
            },
        }
    }
</script>
