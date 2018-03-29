const
fs        = require('fs'),
util      = require('util'),
readFile  = util.promisify(fs.readFile)

module.exports = class
{
  constructor(directory, options)
  {
    if(typeof directory != 'string')
      throw new Error('directory required')

    this.directory  = directory
    this.options    = options
  }

  async fetchTranslation(key, ctx, ...lang)
  {
    if(key == undefined)
      throw new Error(`translation key required`)

    if(!ctx)
      ctx = []

    if(!Array.isArray(ctx))
      ctx = [ctx]

    lang = [].concat.apply([], lang).concat(this.options.fallback).filter(_=>_)
    for(let i = 0; i < lang.length; i++)
      try
      {
        const msg = await this.fetchTemplate(key, lang[i])
        return util.format(msg, ...ctx)
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
