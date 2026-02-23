import React from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { useNavigation } from '@/hooks/use-navigation';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

const EditProductPage = () => {
    const router = useRouter();


    return (
        <DashboardLayout
            title={`Editar Perfume `}
            isMainPage={false}
        >
            <></>
        </DashboardLayout>
    );
};

export default EditProductPage;