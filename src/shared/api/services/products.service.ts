import { ProductsRepo } from '@/shared/api/repositories/products.repo';
import { ProductInput, ProductListParams } from '@/types/product/product.types';

export const ProductsService = {
  list: (listParams: ProductListParams) =>
    ProductsRepo.findAll(listParams),

  getByUuid: async (productUuid: string) => {
    const product = await ProductsRepo.findByUuid(productUuid);
    if (!product) throw new Error('Producto no encontrado');
    return product;
  },

  create: (productInput: ProductInput) =>
    ProductsRepo.create(productInput),

  update: (
    productUuid: string,
    productData: Partial<Omit<ProductInput, 'variants' | 'images'>>,
  ) => ProductsRepo.update(productUuid, productData),

  delete: (productUuid: string) =>
    ProductsRepo.softDelete(productUuid),
};
