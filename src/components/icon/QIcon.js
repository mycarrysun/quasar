export default {
  name: 'q-icon',
  functional: true,
  props: {
    name: String,
    mat: String,
    ios: String,
    color: String,
    size: String,
    brand: Boolean
  },
  render (h, ctx) {
    let name, text
    const
      prop = ctx.props,
      data = ctx.data,
      theme = ctx.parent.$q.theme,
      cls = ctx.data.staticClass,
      icon = prop.mat && theme === 'mat'
        ? prop.mat
        : (prop.ios && theme === 'ios' ? prop.ios : ctx.props.name)

    if (!icon) {
      name = ''
    }
    else if (icon.startsWith('fa-')) {
      name = `${icon}`
      if (ctx.props.brand) {
        name += 'fab'
      }
      else {
        name += 'fa'
      }
    }
    else if (icon.startsWith('ion-') || icon.startsWith('icon-')) {
      name = `${icon}`
    }
    else {
      name = 'material-icons'
      text = icon.replace(/ /g, '_')
    }

    data.staticClass = `${cls ? cls + ' ' : ''}q-icon${name.length ? ` ${name}` : ''}${prop.color ? ` text-${prop.color}` : ''}`

    if (!data.hasOwnProperty('attrs')) {
      data.attrs = {}
    }
    data.attrs['aria-hidden'] = 'true'

    if (prop.size) {
      const style = `font-size: ${prop.size};`
      data.style = data.style
        ? [data.style, style]
        : style
    }

    return h('i', data, text ? [text, ctx.children] : [' ', ctx.children])
  }
}
