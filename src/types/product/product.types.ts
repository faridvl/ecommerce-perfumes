export interface ProductVariant {
  id: number;
  uuid: string;
  product_id: number;
  size_ml: number;
  concentration: 'EDT' | 'EDP' | 'Parfum' | 'Colonia';
  price_usd: number;
  stock: number;
  sku: string;
  is_active: boolean;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  uuid: string;
  name: string;
  brand: string;
  description: string;
  slug: string;
  is_active: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at: string;
}

export interface ProductInput {
  name: string;
  brand: string;
  description?: string;
  slug: string;
  variants: Omit<ProductVariant, 'id' | 'uuid' | 'product_id'>[];
  images: Omit<ProductImage, 'id' | 'product_id'>[];
}

export interface ProductListParams {
  pageNumber: number;
  pageLimit: number;
  search?: string;
  brand?: string;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  pageNumber: number;
  pageLimit: number;
}
