import React from 'react';
import Head from 'next/head';
import { ShoppingBagIcon } from '@heroicons/react/24/outline'; // O cualquier librería de iconos
import { Typography, TypographyVariant } from '../../typography/typography';
import { Header } from '../../header/header';

interface StoreLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header isAdmin={false} />
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
                {children}
            </main>


            {/* Footer elegante */}
            <footer className="bg-neutral-900 py-10 text-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <Typography variant={TypographyVariant.BODY} className="text-neutral-400 text-sm">
                        © 2026 ScentStack. Todos los derechos reservados.
                    </Typography>
                    <div className="flex gap-8">
                        <Typography variant={TypographyVariant.LINK_TEXT} className="text-neutral-300 hover:text-white transition-colors text-sm">Contacto</Typography>
                        <Typography variant={TypographyVariant.LINK_TEXT} className="text-neutral-300 hover:text-white transition-colors text-sm">Envíos</Typography>
                    </div>
                </div>
            </footer>
        </div>
    );
};