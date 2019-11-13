import * as R from 'ramda'
import React, { useState, useRef, FunctionComponent } from 'react'
import { SearchResults, SearchResultItem } from '@knr/models'
import './Main.scss'

const Main: FunctionComponent = () => {

  const [ companyName, setCompanyName ] = useState<string>('')
  const [ results, setResults ] = useState<SearchResults>([])
  const [ disabled, setDisabled ] = useState(false)

  const search = async (name: string) => {
    setDisabled(true)
    const res = await fetch(`/api/ytj/search?name=${name}`)
    const results: SearchResults = await res.json()
    setResults(results)
    setDisabled(false)
  }

  let throttle = useRef<number | undefined>()

  const onCompanyNameChange = ({ target: { value: companyName } }: React.ChangeEvent<HTMLInputElement>) => {
    if (R.isEmpty(companyName)) {
      setResults([])
    } else {
      setCompanyName(companyName)
      window.clearTimeout(throttle.current)
      throttle.current = window.setTimeout(() => search(companyName), 500)
    }
  }

  return (
    <div className="container">
      <h2>YTJ Search</h2>
      <input
        className="search"
        type="search"
        name="companyName"
        placeholder="Company name"
        disabled={disabled}
        onChange={onCompanyNameChange} />
      <table className="results">
        <tbody>
        {results.map((result: SearchResultItem, idx) => {
          return (
            <tr key={idx}>
               <td className="resultRow">
                 <span className="name">{result.name || '-'}</span>
                 <span className="idType">{result.id} | {result.type}</span>
               </td>
            </tr>
           )
         })}
        </tbody>
      </table>
    </div>
  )
}

export default Main
