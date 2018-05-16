const
fs        = require('fs'),
util      = require('util')

module.exports = class
{
  constructor(directory, handlebars, options)
  {
    if(typeof directory != 'string')
      throw new Error('directory required')

    if(typeof handlebars != 'object')
      throw new Error('handlebars required')

    this.directory  = directory
    this.handlebars = handlebars
    this.config     = Object.assign({ cache : true }, options)
    this.templates = {};
  }

  fetchTranslation(key, ctx, ...lang)
  {
    if(key == undefined)
      throw new Error(`translation key required`)

    lang = [].concat.apply([], lang).concat(this.config.fallback).filter(_=>_)
    for(let i = 0; i < lang.length; i++)
      try
      {
        const template = this.fetchCompiledTemplate(key, lang[i])
        return template(ctx)
      }
      catch(error)
      {
        continue
      }

    return key
  }

  fetchCompiledTemplate(key, lang)
  {
    if(!this.config.cache)
      return this.handlebars.compile(this.fetchTemplate(key, lang))
    
    if(!lang in this.templates)
      this.templates[lang] = {}
    
    if(!key in this.templates[lang])
      this.templates[lang][key] = this.handlebars.compile(this.fetchTemplate(key, lang))
    
    return this.templates[lang][key]
  }

  fetchTemplate(key, lang)
  {
    return fs.readFileSync(`${this.directory}/${lang}/${key}`, 'utf-8')
  }

  setTranslation(key, lang, msg)
  {
    throw new Error('unsupported, will in the future write to disc')
  }

  removeTranslation(key, lang)
  {
    throw new Error('unsupported, will in the future remove from disc')
  }
}
