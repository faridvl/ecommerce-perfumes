import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useProductDetailQuery } from '@/shared/api/querys/inventory/use-product-detail-query';
import { useUpdateProductMutation } from '@/shared/api/mutations/inventory/use-update-product-mutation';
import { PRODUCTS_QUERY_KEY } from '@/shared/api/querys/inventory/use-products-query';
import { PRODUCT_DETAIL_QUERY_KEY } from '@/shared/api/querys/inventory/use-product-detail-query';
import { useNavigation } from '@/hooks/use-navigation';

const editSchema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  brand: yup.string().required('La marca es requerida'),
  description: yup.string().default(''),
  slug: yup
    .string()
    .required('El slug es requerido')
    .matches(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
});

type EditFormValues = yup.InferType<typeof editSchema>;

export function useInventoryEdit() {
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const productUuid = router.query.id as string;

  const { data: product, isLoading: isLoadingProduct } = useProductDetailQuery(productUuid);
  const { executeUpdate, isPending, error: hasError } = useUpdateProductMutation();

  const form = useForm<EditFormValues>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      slug: '',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        brand: product.brand,
        description: product.description ?? '',
        slug: product.slug,
      });
    }
  }, [product, form]);

  const handleCancel = () => navigation.admin.inventory.index();

  const handleSubmit = form.handleSubmit((editFormValues) => {
    if (!productUuid) return;
    executeUpdate(
      { productUuid, productData: editFormValues },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
          queryClient.invalidateQueries({ queryKey: [PRODUCT_DETAIL_QUERY_KEY, productUuid] });
          navigation.admin.inventory.index();
        },
      },
    );
  });

  return {
    form,
    product,
    isLoadingProduct,
    isPending,
    hasError,
    handleCancel,
    handleSubmit,
  };
}
