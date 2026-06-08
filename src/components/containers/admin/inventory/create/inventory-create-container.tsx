import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { useInventoryCreate } from './use-inventory-create';

const inputClass =
  'w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary transition-colors';

const errorClass = 'text-red-500 text-xs mt-1';

const sectionClass = 'bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col gap-5';

export function InventoryCreateContainer() {
  const { t } = useTranslation();
  const {
    form,
    variantFields,
    imageFields,
    concentrationOptions,
    isPending,
    hasError,
    handleAddVariant,
    handleRemoveVariant,
    handleAddImage,
    handleRemoveImage,
    handleCancel,
    handleSubmit,
  } = useInventoryCreate();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">

      {/* Sección: Información General */}
      <div className={sectionClass}>
        <Typography variant={TypographyVariant.SUBTITLE}>
          {t(TEXT.ADMIN.INVENTORY.CREATE.SECTION_INFO)}
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-neutral-700 mb-1">
              {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_NAME)}
            </label>
            <input
              {...register('name')}
              placeholder={t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_NAME_PLACEHOLDER)}
              className={tailwind(inputClass, errors.name && 'border-red-400')}
            />
            {errors.name && <span className={errorClass}>{errors.name.message}</span>}
          </div>

          {/* Marca */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-neutral-700 mb-1">
              {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_BRAND)}
            </label>
            <input
              {...register('brand')}
              placeholder={t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_BRAND_PLACEHOLDER)}
              className={tailwind(inputClass, errors.brand && 'border-red-400')}
            />
            {errors.brand && <span className={errorClass}>{errors.brand.message}</span>}
          </div>

          {/* Slug */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-sm font-semibold text-neutral-700 mb-1">
              {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_SLUG)}
            </label>
            <input
              {...register('slug')}
              placeholder={t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_SLUG_PLACEHOLDER)}
              className={tailwind(inputClass, 'font-mono text-xs', errors.slug && 'border-red-400')}
            />
            {errors.slug && <span className={errorClass}>{errors.slug.message}</span>}
          </div>

          {/* Descripción */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-sm font-semibold text-neutral-700 mb-1">
              {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_DESCRIPTION)}
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder={t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_DESCRIPTION_PLACEHOLDER)}
              className={tailwind(inputClass, 'resize-none')}
            />
          </div>
        </div>
      </div>

      {/* Sección: Variantes */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <Typography variant={TypographyVariant.SUBTITLE}>
            {t(TEXT.ADMIN.INVENTORY.CREATE.SECTION_VARIANTS)}
          </Typography>
          <button
            type="button"
            onClick={handleAddVariant}
            className="text-sm text-primary font-semibold hover:underline"
          >
            {t(TEXT.ADMIN.INVENTORY.CREATE.ADD_VARIANT)}
          </button>
        </div>

        {errors.variants?.root && (
          <span className={errorClass}>{errors.variants.root.message}</span>
        )}

        {variantFields.map((variantField, variantIndex) => (
          <div
            key={variantField.id}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-5 border-b border-neutral-100 last:border-0 last:pb-0"
          >
            {/* Tamaño */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-500 mb-1">
                {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_SIZE)}
              </label>
              <input
                type="number"
                {...register(`variants.${variantIndex}.size_ml`)}
                className={tailwind(
                  inputClass,
                  errors.variants?.[variantIndex]?.size_ml && 'border-red-400',
                )}
              />
              {errors.variants?.[variantIndex]?.size_ml && (
                <span className={errorClass}>
                  {errors.variants[variantIndex].size_ml?.message}
                </span>
              )}
            </div>

            {/* Concentración */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-500 mb-1">
                {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_CONCENTRATION)}
              </label>
              <select
                {...register(`variants.${variantIndex}.concentration`)}
                className={tailwind(inputClass, 'bg-neutral-50')}
              >
                {concentrationOptions.map((concentrationOption) => (
                  <option key={concentrationOption} value={concentrationOption}>
                    {concentrationOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-500 mb-1">
                {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_PRICE)}
              </label>
              <input
                type="number"
                step="0.01"
                {...register(`variants.${variantIndex}.price_usd`)}
                className={tailwind(
                  inputClass,
                  errors.variants?.[variantIndex]?.price_usd && 'border-red-400',
                )}
              />
            </div>

            {/* Stock */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-500 mb-1">
                {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_STOCK)}
              </label>
              <input
                type="number"
                {...register(`variants.${variantIndex}.stock`)}
                className={tailwind(
                  inputClass,
                  errors.variants?.[variantIndex]?.stock && 'border-red-400',
                )}
              />
            </div>

            {/* SKU */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-500 mb-1">
                {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_SKU)}
              </label>
              <input
                {...register(`variants.${variantIndex}.sku`)}
                className={tailwind(
                  inputClass,
                  'font-mono text-xs',
                  errors.variants?.[variantIndex]?.sku && 'border-red-400',
                )}
              />
            </div>

            {/* Eliminar variante */}
            {variantFields.length > 1 && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(variantIndex)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sección: Imágenes */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <Typography variant={TypographyVariant.SUBTITLE}>
            {t(TEXT.ADMIN.INVENTORY.CREATE.SECTION_IMAGES)}
          </Typography>
          <button
            type="button"
            onClick={handleAddImage}
            className="text-sm text-primary font-semibold hover:underline"
          >
            {t(TEXT.ADMIN.INVENTORY.CREATE.ADD_IMAGE)}
          </button>
        </div>

        {imageFields.map((imageField, imageIndex) => (
          <div
            key={imageField.id}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-neutral-100 last:border-0 last:pb-0"
          >
            {/* URL */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-500 mb-1">
                {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_IMAGE_URL)}
              </label>
              <input
                {...register(`images.${imageIndex}.url`)}
                placeholder="https://..."
                className={tailwind(
                  inputClass,
                  errors.images?.[imageIndex]?.url && 'border-red-400',
                )}
              />
              {errors.images?.[imageIndex]?.url && (
                <span className={errorClass}>{errors.images[imageIndex].url?.message}</span>
              )}
            </div>

            {/* Alt text */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-500 mb-1">
                {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_ALT_TEXT)}
              </label>
              <input
                {...register(`images.${imageIndex}.alt_text`)}
                className={inputClass}
              />
            </div>

            {/* Imagen principal + Eliminar */}
            <div className="flex items-center gap-4 sm:col-span-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register(`images.${imageIndex}.is_primary`)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-xs text-neutral-600">
                  {t(TEXT.ADMIN.INVENTORY.CREATE.FIELD_IS_PRIMARY)}
                </span>
              </label>
              <button
                type="button"
                onClick={() => handleRemoveImage(imageIndex)}
                className="ml-auto p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {imageFields.length === 0 && (
          <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
            Sin imágenes — el producto usará una imagen genérica.
          </Typography>
        )}
      </div>

      {/* Error general */}
      {hasError && (
        <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
          Ocurrió un error al guardar. Intenta de nuevo.
        </Typography>
      )}

      {/* Footer */}
      <div className="flex gap-4 justify-end pb-8">
        <Button
          variant={ButtonVariant.CANCEL}
          text={t(TEXT.ADMIN.INVENTORY.CREATE.CANCEL)}
          onClick={handleCancel}
          disabled={isPending}
        />
        <Button
          variant={ButtonVariant.PRIMARY}
          text={isPending ? t(TEXT.GENERAL.BUTTONS.LOADING) : t(TEXT.ADMIN.INVENTORY.CREATE.SUBMIT)}
          type="submit"
          disabled={isPending}
          className="px-10"
        />
      </div>
    </form>
  );
}
