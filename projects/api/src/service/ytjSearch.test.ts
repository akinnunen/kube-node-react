import R from 'ramda'
import { SearchResults } from '@knr/models'
import * as search from './ytjSearch'

test('finds Green Herring Labs Oy', async () => {
  const results: SearchResults = await search.run('herring')
  expect(R.any(R.propEq('id', '3097199-1'))(results.items)).toBeTruthy()
  expect(results.message).toBe(undefined)
})

test('returns an error message when too many results', async () => {
  const results: SearchResults = await search.run('aaa')
  expect(results.items.length).toBe(0)
  expect(results.message).not.toBe(undefined)
})

test('returns an error message when no results', async () => {
  const results: SearchResults = await search.run('asdasd')
  expect(results.items.length).toBe(0)
  expect(results.message).not.toBe(undefined)
})

test('throws an error when keyword is too short', async () => {
  try {
    await search.run('aa')
    fail('Should not reach here')
  } catch(e) {
  }

})
