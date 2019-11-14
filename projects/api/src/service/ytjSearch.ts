import R from 'ramda'
import request from 'request-promise-native'
import cheerio from 'cheerio'
import randomUserAgent from 'random-useragent'
import { SearchResults, SearchResultItem } from '@knr/models'

const url = 'https://tietopalvelu.ytj.fi/yrityshaku.aspx?kielikoodi=1'
const tooManySearchResults = 'Hakutuloksia yli 200'
const noSearchResults = 'Hakuehdoilla ei löytynyt'

/**
 * Search params consist of hidden security related form fields (that are
 * read from the html) and fields present in the search form.
 */
const buildSearchParams = (keyword: string, $: CheerioSelector): object => {

  const securityFields = [
    '__LASTFOCUS',
    '__EVENTTARGET',
    '__EVENTARGUMENT',
    '__VIEWSTATE',
    '__VIEWSTATEGENERATOR',
    '__EVENTVALIDATION'
  ]

  const formFields = {
    '_ctl0:cphSisalto:hakusana': keyword,
    '_ctl0:cphSisalto:ytunnus': '',
    '_ctl0:cphSisalto:yrmu': '',
    '_ctl0:cphSisalto:LEItunnus': '',
    '_ctl0:cphSisalto:sort': 'sort1',
    '_ctl0:cphSisalto:suodatus': 'suodatus1',
    '_ctl0:cphSisalto:hidsortorder': '2',
    '_ctl0:cphSisalto:Hae': 'Hae'
  }

  const searchParams = R.pipe(
    R.map((field: string) => ({ [field]: $(`input[name="${field}"]`).val() })),
    R.mergeAll,
    R.mergeLeft(formFields)
  )(securityFields)

  return searchParams

}

const buildSearchResults = ($: CheerioSelector): SearchResults => {

   const trAsResultItem = (tr: CheerioElement): SearchResultItem => {
    const [ aElem, nameElem, typeElem ] = $(tr).find('td').toArray()
    const id = $(aElem).text().trim()
    const uri = $(aElem).find('a').attr('href')
    const name = $(nameElem).text().trim()
    const type = $(typeElem).text().trim()
    return { id, name, type, uri }
  }

  return {
    items: $('div[id="search-result"]')
      .find('table > tbody > tr')
      .toArray()
      .slice(1)
      .map(trAsResultItem)
   }
}

/**
 * Does not currently read paged results or retry failed requests.
 */
const run = async (keyword: string): Promise<SearchResults> => {

  if (keyword.length < 3) {
    throw { status: 400, message: 'Search keyword has to be at least 3 characters long.' }
  }

  const jar = request.jar()

  const getResponse = await request.get({ url, jar })
  const $getResponse = cheerio.load(getResponse)
  const searchParams = buildSearchParams(keyword, $getResponse)

  const postResponse = await request.post({
    url,
    jar,
    form: searchParams,
    headers: { 'User-Agent': randomUserAgent.getRandom() }
  })

  if (postResponse.includes(tooManySearchResults)) {
    return { items: [], message: 'Too many search results. Please refine your search.' }
  }

  if (postResponse.includes(noSearchResults)) {
    return { items: [], message: 'No search results.' }
  }

  const $postResponse = cheerio.load(postResponse)
  const results = buildSearchResults($postResponse)

  return results

}

export {
  run
}
