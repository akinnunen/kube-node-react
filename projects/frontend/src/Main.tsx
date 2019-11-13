import React, { useState, useRef, FunctionComponent } from 'react'
import { SearchResults, SearchResultItem } from '@knr/models'

type MainProps = {
  title: string,
  body: string
}

const Main: FunctionComponent<MainProps> = ({ title, body }) => {

  const [ companyName, setCompanyName ] = useState('')

  const search = async (name) => {
    const res = await fetch(`http://localhost:8080/api/ytj/search?name=${name}`)
    console.log('search', name, res)
  }

  let throttle = useRef()

  const onCompanyNameChange = ({ target: { value: companyName } }) => {
    setCompanyName(companyName)
    clearTimeout(throttle.current)
    throttle.current = setTimeout(() => search(companyName), 500)
  }

  return (
    <div>
      <h2>{title}</h2>
      <input type="search" name="companyName" onChange={onCompanyNameChange} />
      <p>
        {body}
      </p>
    </div>
  )
}

export default Main
