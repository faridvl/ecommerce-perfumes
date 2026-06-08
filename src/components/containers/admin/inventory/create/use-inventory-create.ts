import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateProductMutation } from '@/shared/api/mutations/inventory/use-create-product-mutation';
import { PRODUCTS_QUERY_KEY } from '@/shared/api/querys/inventory/use-products-query';
import { useNavigation } from '@/hooks/use-navigation';

const CONCENTRATION_OPTIONS = ['EDT', 'EDP', 'Parfum', 'Colonia'] as const;

const variantSchema = yup.object({
  size_ml: yup
    .number()
    .typeError('Debe ser un número')
    .required('Requerido')
    .positive('Debe ser mayor a 0'),
  concentration: yup
    .string()
    .oneOf(CONCENTRATION_OPTIONS, 'Concentración no válida')
    .required('Requerido'),
  price_usd: yup
    .number()
    .typeError('Debe ser un número')
    .required('Requerido')
    .positive('Debe ser mayor a 0'),
  stock: yup
    .number()
    .typeError('Debe ser un número')
    .required('Requerido')
    .min(0, 'No puede ser negativo'),
  sku: yup.string().required('Requerido'),
  is_active: yup.boolean().default(true),
});

const imageSchema = yup.object({
  url: yup.string().url('URL no válida').required('Requerido'),
  alt_text: yup.string().default(''),
  is_primary: yup.boolean().default(false),
  sort_order: yup.number().default(0),
});

const productSchema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  brand: yup.string().required('La marca es requerida'),
  description: yup.string().default(''),
  slug: yup
    .string()
    .required('El slug es requerido')
    .matches(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  variants: yup.array().of(variantSchema).min(1, 'Agrega al menos una variante').required(),
  images: yup.array().of(imageSchema).default([]),
});

type ProductFormValues = yup.InferType<typeof productSchema>;

const DEFAULT_VARIANT = {
  size_ml: 0,
  concentration: 'EDP' as const,
  price_usd: 0,
  stock: 0,
  sku: '',
  is_active: true,
};

const DEFAULT_IMAGE = {
  url: '',
  alt_text: '',
  is_primary: false,
  sort_order: 0,
};

export function useInventoryCreate() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { executeCreate, isPending, error: hasError } = useCreateProductMutation();

  const form = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      slug: '',
      variants: [{ ...DEFAULT_VARIANT }],
      images: [],
    },
  });

  const variantFields = useFieldArray({ control: form.control, name: 'variants' });
  const imageFields = useFieldArray({ control: form.control, name: 'images' });

  const watchedName = form.watch('name');

  useEffect(() => {
    const generatedSlug = watchedName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    form.setValue('slug', generatedSlug, { shouldValidate: false });
  }, [watchedName, form]);

  const handleAddVariant = () => variantFields.append({ ...DEFAULT_VARIANT });

  const handleRemoveVariant = (variantIndex: number) => variantFields.remove(variantIndex);

  const handleAddImage = () => imageFields.append({ ...DEFAULT_IMAGE });

  const handleRemoveImage = (imageIndex: number) => imageFields.remove(imageIndex);

  const handleCancel = () => navigation.admin.inventory.index();

  const handleSubmit = form.handleSubmit((productFormValues) => {
    executeCreate(productFormValues, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
        navigation.admin.inventory.index();
      },
    });
  });

  return {
    form,
    variantFields: variantFields.fields,
    imageFields: imageFields.fields,
    concentrationOptions: CONCENTRATION_OPTIONS,
    isPending,
    hasError,
    handleAddVariant,
    handleRemoveVariant,
    handleAddImage,
    handleRemoveImage,
    handleCancel,
    handleSubmit,
  };
}
