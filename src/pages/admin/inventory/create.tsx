import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { useNavigation } from '@/hooks/use-navigation';
import { Button, ButtonVariant } from '@/components/common/button/button';

const CreateProductPage = () => {
    const { back } = useNavigation();

    return (
        <DashboardLayout
            title="Nuevo Perfume"
            isMainPage={false} // Esto activa automáticamente el botón "Atrás" en tu Header
        >
            <></>
            {/* {(layout) => {
                // Configuramos el botón de volver manualmente si es necesario
           <></>
            }}> */}
        </DashboardLayout>
    );
};

export default CreateProductPage;