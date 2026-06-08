import sql from '@/lib/db';
import {
  Product,
  ProductInput,
  ProductListParams,
  PaginatedProducts,
} from '@/types/product/product.types';

export const ProductsRepo = {
  findAll: async ({
    pageNumber,
    pageLimit,
    search,
    brand,
  }: ProductListParams): Promise<PaginatedProducts> => {
    const offset = (pageNumber - 1) * pageLimit;
    const searchFilter = search?.trim() || null;
    const brandFilter = brand?.trim() || null;
    const searchPattern = searchFilter ? `%${searchFilter}%` : null;

    const [countResult] = await sql`
      SELECT COUNT(*)::int AS total
      FROM products product
      WHERE product.is_active = true
        AND (${searchFilter}::text IS NULL
          OR product.name  ILIKE ${searchPattern}::text
          OR product.brand ILIKE ${searchPattern}::text)
        AND (${brandFilter}::text IS NULL OR product.brand = ${brandFilter}::text)
    `;

    const productRows = await sql`
      SELECT
        product.id,
        product.uuid,
        product.name,
        product.brand,
        product.description,
        product.slug,
        product.is_active,
        product.created_at,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id',            variant.id,
            'uuid',          variant.uuid,
            'product_id',    variant.product_id,
            'size_ml',       variant.size_ml,
            'concentration', variant.concentration,
            'price_usd',     variant.price_usd,
            'stock',         variant.stock,
            'sku',           variant.sku,
            'is_active',     variant.is_active
          )) FILTER (WHERE variant.id IS NOT NULL), '[]'
        ) AS variants,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id',         image.id,
            'product_id', image.product_id,
            'url',        image.url,
            'alt_text',   image.alt_text,
            'is_primary', image.is_primary,
            'sort_order', image.sort_order
          )) FILTER (WHERE image.id IS NOT NULL), '[]'
        ) AS images
      FROM products product
      LEFT JOIN product_variants variant ON variant.product_id = product.id AND variant.is_active = true
      LEFT JOIN product_images   image   ON image.product_id   = product.id
      WHERE product.is_active = true
        AND (${searchFilter}::text IS NULL
          OR product.name  ILIKE ${searchPattern}::text
          OR product.brand ILIKE ${searchPattern}::text)
        AND (${brandFilter}::text IS NULL OR product.brand = ${brandFilter}::text)
      GROUP BY product.id
      ORDER BY product.created_at DESC
      LIMIT ${pageLimit} OFFSET ${offset}
    `;

    return {
      data: productRows as unknown as Product[],
      total: countResult.total,
      pageNumber,
      pageLimit,
    };
  },

  findByUuid: async (productUuid: string): Promise<Product | null> => {
    const productRows = await sql`
      SELECT
        product.id,
        product.uuid,
        product.name,
        product.brand,
        product.description,
        product.slug,
        product.is_active,
        product.created_at,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id',            variant.id,
            'uuid',          variant.uuid,
            'product_id',    variant.product_id,
            'size_ml',       variant.size_ml,
            'concentration', variant.concentration,
            'price_usd',     variant.price_usd,
            'stock',         variant.stock,
            'sku',           variant.sku,
            'is_active',     variant.is_active
          )) FILTER (WHERE variant.id IS NOT NULL), '[]'
        ) AS variants,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id',         image.id,
            'product_id', image.product_id,
            'url',        image.url,
            'alt_text',   image.alt_text,
            'is_primary', image.is_primary,
            'sort_order', image.sort_order
          )) FILTER (WHERE image.id IS NOT NULL), '[]'
        ) AS images
      FROM products product
      LEFT JOIN product_variants variant ON variant.product_id = product.id AND variant.is_active = true
      LEFT JOIN product_images   image   ON image.product_id   = product.id
      WHERE (product.uuid::text = ${productUuid} OR product.slug = ${productUuid})
      GROUP BY product.id
      LIMIT 1
    `;

    return (productRows[0] as unknown as Product) ?? null;
  },

  create: async (productInput: ProductInput): Promise<Product> => {
    const { name, brand, description = '', slug, variants, images } = productInput;

    const [createdProduct] = await sql`
      INSERT INTO products (uuid, name, brand, description, slug, is_active)
      VALUES (gen_random_uuid(), ${name}, ${brand}, ${description}, ${slug}, true)
      RETURNING *
    `;

    for (const variantInput of variants) {
      await sql`
        INSERT INTO product_variants
          (uuid, product_id, size_ml, concentration, price_usd, stock, sku, is_active)
        VALUES
          (gen_random_uuid(), ${createdProduct.id}, ${variantInput.size_ml},
           ${variantInput.concentration}, ${variantInput.price_usd},
           ${variantInput.stock}, ${variantInput.sku}, ${variantInput.is_active ?? true})
      `;
    }

    for (const imageInput of images) {
      await sql`
        INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
        VALUES
          (${createdProduct.id}, ${imageInput.url}, ${imageInput.alt_text ?? ''},
           ${imageInput.is_primary}, ${imageInput.sort_order})
      `;
    }

    return ProductsRepo.findByUuid(createdProduct.uuid) as Promise<Product>;
  },

  update: async (
    productUuid: string,
    productData: Partial<Omit<ProductInput, 'variants' | 'images'>>,
  ): Promise<Product | null> => {
    const { name, brand, description, slug } = productData;

    await sql`
      UPDATE products
      SET
        name        = COALESCE(${name        ?? null}, name),
        brand       = COALESCE(${brand       ?? null}, brand),
        description = COALESCE(${description ?? null}, description),
        slug        = COALESCE(${slug        ?? null}, slug)
      WHERE uuid = ${productUuid}
    `;

    return ProductsRepo.findByUuid(productUuid);
  },

  softDelete: async (productUuid: string): Promise<void> => {
    await sql`UPDATE products SET is_active = false WHERE uuid = ${productUuid}`;
  },
};
