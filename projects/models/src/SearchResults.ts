import SearchResultItem from './SearchResultItem'

export default interface SearchResults {

  items: Array<SearchResultItem>
  message?: string

}
