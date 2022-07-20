import { getProductsList } from './handler';

describe('Product Service - getProductsList', () => {
  it('should be defined', async () => {
    expect(getProductsList).toBeDefined();
  });

  it('should return a list of products', async () => {
    const { body } = await getProductsList();
    const parced = JSON.parse(body);
    expect(parced.data).toBeTruthy();
  })
});