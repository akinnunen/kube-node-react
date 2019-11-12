import request from 'request-promise-native'
import cheerio from 'cheerio'
import randomUserAgent from 'random-useragent'

/**
 * Does not currently read paged results
 */
const search = async (name: string) => {

  const url = 'https://tietopalvelu.ytj.fi/yrityshaku.aspx?kielikoodi=1'

  const cookieJar = request.jar()
  const getRes = await request.get({ url, jar: cookieJar })
  const $g = cheerio.load(getRes)

  const hiddenFieldNames = [
    '__LASTFOCUS',
    '__EVENTTARGET',
    '__EVENTARGUMENT',
    '__VIEWSTATE',
    '__VIEWSTATEGENERATOR',
    '__EVENTVALIDATION'
  ]

  const extraSearchParams = Object.assign({}, ...hiddenFieldNames.map((name) => ({ [name]: $g(`input[name="${name}"]`).val() })))

  const searchParams = Object.assign({
    '_ctl0:cphSisalto:hakusana': name,
    '_ctl0:cphSisalto:ytunnus': '',
    '_ctl0:cphSisalto:yrmu': '',
    '_ctl0:cphSisalto:LEItunnus': '',
    '_ctl0:cphSisalto:sort': 'sort1',
    '_ctl0:cphSisalto:suodatus': 'suodatus1',
    '_ctl0:cphSisalto:hidsortorder': '2',
    '_ctl0:cphSisalto:Hae': 'Hae'
  }, extraSearchParams)

  const searchRes = await request.post({
    url,
    form: searchParams,
    headers: {
      'User-Agent': randomUserAgent.getRandom()
    },
    jar: cookieJar
  })

  if (searchRes.includes('Hakutuloksia yli 200')) {
    throw new Error('Too many search results, please refine your search')
  }

  const $s = cheerio.load(searchRes)

  const trsAsResults = (tr: CheerioElement) => {

    const [ aElem, nameElem, typeElem ] = $s(tr).find('td').toArray()

    const id = $s(aElem).text().trim()
    const uri = $s(aElem).find('a').attr('href')
    const name = $s(nameElem).text().trim()
    const type = $s(typeElem).text().trim()

    return { id, name, type, uri }
  }

  const res = $s('div[id="search-result"]')
    .find('table > tbody > tr')
    .toArray()
    .slice(1)
    .map(trsAsResults)

  return res

}

export {
  search
}
