export default {
    name: 'q-card',
    functional: true,
    props: {
        square: Boolean,
        flat: Boolean,
        inline: Boolean,
        color: String,
        collapsible: Boolean,
        enlargeable: Boolean,
    },
    render(h, ctx) {
        const
            data = ctx.data,
            classes = data.staticClass,
            prop = ctx.props

        let cls = ['q-card']
        if(prop.square){
            cls.push('no-border-radius')
        }
        if(prop.flat){
            cls.push('no-shadow')
        }
        if(prop.inline){
            cls.push('inline-block')
        }
        if(prop.color){
            cls.push(`bg-${prop.color} text-white q-card-dark`)
        }
        if(prop.collapsible){
            cls.push('q-card-collapsible')
        }

        data.staticClass = `${cls.join(' ')}${classes ? ` ${classes}` : ''}`

        return h(
            'div',
            data,
            ctx.children
        )
    }
}
