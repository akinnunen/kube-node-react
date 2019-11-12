import R from 'ramda'
import { SearchResults } from '@knr/models'
import * as ytjSearch from './ytjSearch'

test('ytjSearch finds Green Herring Labs Oy', async () => {
  const results: SearchResults = await ytjSearch.run('herring')
  expect(R.any(R.propEq('id', '3097199-1'))(results)).toBeTruthy()
});
