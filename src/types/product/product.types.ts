export type ProductConcentration = 'EDT' | 'EDP' | 'Parfum' | 'Colonia';
export type ProductGender = 'hombre' | 'mujer' | 'unisex';
export type OlfactoryFamily = 'floral' | 'oriental' | 'fresco' | 'madero' | 'cítrico' | 'gourmand' | 'amaderado' | 'acuático';
export type PresentationType = 'botella' | 'decant';
export type ProductSort = 'created_at_desc' | 'price_asc' | 'price_desc' | 'name_asc';

export interface ProductVariant {
  id: number;
  uuid: string;
  product_id: number;
  size_ml: number;
  concentration: ProductConcentration;
  price_usd: number;
  stock: number;
  sku: string;
  is_active: boolean;
  presentation_type?: PresentationType;
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
  gender?: ProductGender;
  olfactory_family?: OlfactoryFamily;
}

export interface ProductInput {
  name: string;
  brand: string;
  description?: string;
  slug: string;
  gender?: ProductGender;
  olfactory_family?: OlfactoryFamily;
  variants: Omit<ProductVariant, 'id' | 'uuid' | 'product_id'>[];
  images: Omit<ProductImage, 'id' | 'product_id'>[];
}

export interface ProductListParams {
  pageNumber: number;
  pageLimit: number;
  search?: string;
  brand?: string;
  gender?: ProductGender;
  olfactory_family?: OlfactoryFamily;
  presentation_type?: PresentationType;
  min_price?: number;
  max_price?: number;
  sort?: ProductSort;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  pageNumber: number;
  pageLimit: number;
}
