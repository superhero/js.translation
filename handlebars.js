const
fs        = require('fs'),
util      = require('util'),
readFile  = util.promisify(fs.readFile)

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
    this.config     = options || {}
  }

  async fetchTranslation(key, ctx, ...lang)
  {
    if(key == undefined)
      throw new Error(`translation key required`)

    lang = [].concat.apply([], lang).concat(this.config.fallback).filter(_=>_)
    for(let i = 0; i < lang.length; i++)
      try
      {
        const
        source    = await this.fetchTemplate(key, lang[i]),
        template  = this.handlebars.compile(source)

        return template(ctx)
      }
      catch(error)
      {
        continue
      }

    return key
  }

  async fetchTemplate(key, lang)
  {
    return readFile(`${this.directory}/${lang}/${key}`, 'utf-8')
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
