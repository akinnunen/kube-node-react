import * as ytjSearch from './ytjSearch'

test('', async () => {

  const res = await ytjSearch.search('herring')
  console.log(res)

  // expect(sum(1, 2)).toBe(3);
});
