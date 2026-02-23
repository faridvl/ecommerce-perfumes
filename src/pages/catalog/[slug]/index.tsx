import React from 'react';
import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';
import { withOptionalAuth } from '@/hocs/auth';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';

const ProductDetailPage = () => {
    return (
        <StoreLayout title="Detalle de Perfume">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10">
                <div className="aspect-square bg-neutral-50 rounded-3xl flex items-center justify-center">
                    <Typography variant={TypographyVariant.CAPTION}>Imagen HD Perfume</Typography>
                </div>
                <div className="flex flex-col gap-6">
                    <Typography variant={TypographyVariant.OVERLINE}>EDP - 100ml</Typography>
                    <Typography variant={TypographyVariant.HEADER}>Midnight Oud</Typography>
                    <Typography variant={TypographyVariant.ACCENT} className="text-2xl">$1,200.00 MXN</Typography>
                    <Typography variant={TypographyVariant.BODY}>
                        Una fragancia profunda con notas de salida de bergamota, corazón de oud ahumado y fondo de cuero premium. Ideal para noches de gala.
                    </Typography>
                    <Button variant={ButtonVariant.ACCENT} text="Añadir al Carrito" className="h-14 text-lg" />
                </div>
            </div>
        </StoreLayout>
    );
};

// export const getServerSideProps = withOptionalAuth();
export default ProductDetailPage;