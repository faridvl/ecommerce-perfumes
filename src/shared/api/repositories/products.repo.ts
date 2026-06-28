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
    gender,
    olfactory_family,
    presentation_type,
    min_price,
    max_price,
    sort = 'created_at_desc',
  }: ProductListParams): Promise<PaginatedProducts> => {
    const offset = (pageNumber - 1) * pageLimit;
    const searchFilter = search?.trim() || null;
    const brandFilter = brand?.trim() || null;
    const genderFilter = gender ?? null;
    const olfactoryFilter = olfactory_family ?? null;
    const presentationFilter = presentation_type ?? null;
    const minPriceFilter = min_price ?? null;
    const maxPriceFilter = max_price ?? null;
    const searchPattern = searchFilter ? `%${searchFilter}%` : null;

    const [countResult] = await sql`
      SELECT COUNT(DISTINCT product.id)::int AS total
      FROM products product
      LEFT JOIN product_variants variant ON variant.product_id = product.id AND variant.is_active = true
      WHERE product.is_active = true
        AND (${searchFilter}::text IS NULL
          OR product.name  ILIKE ${searchPattern}::text
          OR product.brand ILIKE ${searchPattern}::text)
        AND (${brandFilter}::text IS NULL OR product.brand = ${brandFilter}::text)
        AND (${genderFilter}::text IS NULL OR product.gender = ${genderFilter}::text)
        AND (${olfactoryFilter}::text IS NULL OR product.olfactory_family = ${olfactoryFilter}::text)
        AND (${presentationFilter}::text IS NULL OR variant.presentation_type = ${presentationFilter}::text)
        AND (${minPriceFilter}::numeric IS NULL OR variant.price_usd >= ${minPriceFilter}::numeric)
        AND (${maxPriceFilter}::numeric IS NULL OR variant.price_usd <= ${maxPriceFilter}::numeric)
    `;

    const orderClause = {
      created_at_desc: sql`product.created_at DESC`,
      price_asc:       sql`MIN(variant.price_usd) ASC NULLS LAST`,
      price_desc:      sql`MIN(variant.price_usd) DESC NULLS LAST`,
      name_asc:        sql`product.name ASC`,
    }[sort] ?? sql`product.created_at DESC`;

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
        product.gender,
        product.olfactory_family,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id',                variant.id,
            'uuid',              variant.uuid,
            'product_id',        variant.product_id,
            'size_ml',           variant.size_ml,
            'concentration',     variant.concentration,
            'price_usd',         variant.price_usd,
            'stock',             variant.stock,
            'sku',               variant.sku,
            'is_active',         variant.is_active,
            'presentation_type', variant.presentation_type
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
        AND (${genderFilter}::text IS NULL OR product.gender = ${genderFilter}::text)
        AND (${olfactoryFilter}::text IS NULL OR product.olfactory_family = ${olfactoryFilter}::text)
        AND (${presentationFilter}::text IS NULL OR variant.presentation_type = ${presentationFilter}::text)
        AND (${minPriceFilter}::numeric IS NULL OR variant.price_usd >= ${minPriceFilter}::numeric)
        AND (${maxPriceFilter}::numeric IS NULL OR variant.price_usd <= ${maxPriceFilter}::numeric)
      GROUP BY product.id
      ORDER BY ${orderClause}
      LIMIT ${pageLimit} OFFSET ${offset}
    `;

    return {
      data: productRows as unknown as Product[],
      total: countResult.total,
      pageNumber,
      pageLimit,
    };
  },

  findAll_brands: async (): Promise<string[]> => {
    const rows = await sql`
      SELECT DISTINCT brand FROM products WHERE is_active = true ORDER BY brand ASC
    `;
    return rows.map((r) => r.brand as string);
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
        product.gender,
        product.olfactory_family,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id',                variant.id,
            'uuid',              variant.uuid,
            'product_id',        variant.product_id,
            'size_ml',           variant.size_ml,
            'concentration',     variant.concentration,
            'price_usd',         variant.price_usd,
            'stock',             variant.stock,
            'sku',               variant.sku,
            'is_active',         variant.is_active,
            'presentation_type', variant.presentation_type
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
    const { name, brand, description = '', slug, gender = null, olfactory_family = null, variants, images } = productInput;

    const [createdProduct] = await sql`
      INSERT INTO products (uuid, name, brand, description, slug, gender, olfactory_family, is_active)
      VALUES (gen_random_uuid(), ${name}, ${brand}, ${description}, ${slug}, ${gender}, ${olfactory_family}, true)
      RETURNING *
    `;

    for (const variantInput of variants) {
      await sql`
        INSERT INTO product_variants
          (uuid, product_id, size_ml, concentration, price_usd, stock, sku, is_active, presentation_type)
        VALUES
          (gen_random_uuid(), ${createdProduct.id}, ${variantInput.size_ml},
           ${variantInput.concentration}, ${variantInput.price_usd},
           ${variantInput.stock}, ${variantInput.sku}, ${variantInput.is_active ?? true},
           ${variantInput.presentation_type ?? 'botella'})
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
    const { name, brand, description, slug, gender, olfactory_family } = productData;

    await sql`
      UPDATE products
      SET
        name             = COALESCE(${name             ?? null}, name),
        brand            = COALESCE(${brand            ?? null}, brand),
        description      = COALESCE(${description      ?? null}, description),
        slug             = COALESCE(${slug             ?? null}, slug),
        gender           = COALESCE(${gender           ?? null}, gender),
        olfactory_family = COALESCE(${olfactory_family ?? null}, olfactory_family)
      WHERE uuid = ${productUuid}
    `;

    return ProductsRepo.findByUuid(productUuid);
  },

  softDelete: async (productUuid: string): Promise<void> => {
    await sql`UPDATE products SET is_active = false WHERE uuid = ${productUuid}`;
  },
};
