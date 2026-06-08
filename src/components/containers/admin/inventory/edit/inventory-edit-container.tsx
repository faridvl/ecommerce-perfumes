import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { useInventoryEdit } from './use-inventory-edit';

const inputClass =
  'w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary transition-colors';

const errorClass = 'text-red-500 text-xs mt-1';

export function InventoryEditContainer() {
  const { t } = useTranslation();
  const {
    form,
    product,
    isLoadingProduct,
    isPending,
    hasError,
    handleCancel,
    handleSubmit,
  } = useInventoryEdit();

  const {
    register,
    formState: { errors },
  } = form;

  if (isLoadingProduct) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl animate-pulse">
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col gap-5">
          <div className="h-5 bg-neutral-200 rounded w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, skeletonIndex) => (
              <div key={skeletonIndex} className={skeletonIndex >= 2 ? 'sm:col-span-2' : ''}>
                <div className="h-3 bg-neutral-200 rounded w-24 mb-2" />
                <div className="h-12 bg-neutral-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
          No se encontró el producto.
        </Typography>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">

      {/* Sección: Información General */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col gap-5">
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
          text={isPending ? t(TEXT.GENERAL.BUTTONS.LOADING) : t(TEXT.ADMIN.INVENTORY.CREATE.EDIT_SUBMIT)}
          type="submit"
          disabled={isPending}
          className="px-10"
        />
      </div>
    </form>
  );
}
