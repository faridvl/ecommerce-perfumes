import React from 'react';
import { unauthorizeServerSidePage } from '@/hocs/auth';
import { useNavigation } from '@/hooks/use-navigation';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';

const LoginPage = () => {
    const { admin } = useNavigation();

    return (
        <div className="h-screen flex items-center justify-center bg-neutral-50 px-6">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-card border border-neutral-100 text-center">
                <Typography variant={TypographyVariant.SUBTITLE} className="mb-2">Bienvenido a ScentStack</Typography>
                <Typography variant={TypographyVariant.BODY} className="mb-8 text-neutral-500">Ingresa tus credenciales para gestionar tu tienda.</Typography>

                <div className="flex flex-col gap-4">
                    <input className="w-full px-4 py-3 border rounded-xl" placeholder="Email" />
                    <input className="w-full px-4 py-3 border rounded-xl" type="password" placeholder="Contraseña" />
                    <Button variant={ButtonVariant.PRIMARY} className="w-full h-12" text="Iniciar Sesión" onClick={() => admin.dashboard()} />
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = unauthorizeServerSidePage();
export default LoginPage;