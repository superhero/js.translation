const util = require('util')

module.exports = class
{
  constructor(translations, options)
  {
    if(typeof translations != 'object')
      throw new Error('translations must be an object')

    this.translations = translations || {}
    this.options      = options
  }

  fetchTranslation(key, ctx, ...lang)
  {
    if(key == undefined)
      throw new Error(`translation key required`)

    if(!ctx)
      ctx = []

    if(!Array.isArray(ctx))
      ctx = [ctx]

    // flattens language param and appends the default fallback, filters empty
    lang = [].concat.apply([], lang).concat(this.options.fallback).filter(_=>_)
    if(key in this.translations)
      for(let i = 0; i < lang.length; i++)
        if(lang in this.translations[key])
          return util.format(this.translations[key][lang], ...ctx)

    return key
  }

  setTranslation(key, lang, msg)
  {
    key in this.translations
    ? this.translations[key][lang] = msg
    : this.translations = { [key] : { [lang] : msg } }
  }

  removeTranslation(key, lang)
  {
    if(lang == undefined)
      delete this.translations[key]

    else if(key in this.translations)
      delete this.translations[key][lang]
  }
}
