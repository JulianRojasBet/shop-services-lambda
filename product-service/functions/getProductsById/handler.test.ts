import { getProductsById } from './handler';

describe('Product Service - getProductsById', () => {
  it('should be defined', async () => {
    expect(getProductsById).toBeDefined();
  });

  it('should return a list of products', async () => {
    const productId = 'product-1';
    const event = { pathParameters: { productId } };
    const { body } = await getProductsById(event);
    const parced = JSON.parse(body);

    if (!parced.data) return expect(false).toBeTruthy();

    expect(parced.data.id).toBe(productId);
  });

  it('should return an error', async () => {
    const productId = 'product-0';
    const event = { pathParameters: { productId } };
    const { body } = await getProductsById(event);
    const parced = JSON.parse(body)

    if (!parced.error) return expect(false).toBeTruthy();

    expect(parced.error).toBe('Product not found');
  });
});