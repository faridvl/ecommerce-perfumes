import { ReactNode } from "react";
import { tailwind } from "@/utils/tailwind-utils";

export enum BoxedLayoutStyle {
    FULL = 'FULL',
    BOXED = 'BOXED',
}

type BoxedLayoutProps = {
    children: ReactNode;
    contentStyle?: BoxedLayoutStyle;
    boxClassName?: string;
    containerClassName?: string;
} & JSX.IntrinsicElements['div'];

export function BoxedLayout({
    contentStyle = BoxedLayoutStyle.BOXED,
    children,
    containerClassName,
    boxClassName,
    ...divProps
}: BoxedLayoutProps) {
    const isBoxed = contentStyle === BoxedLayoutStyle.BOXED;

    return (
        <div
            className={tailwind('flex flex-row h-full w-full justify-center', containerClassName)}
            {...divProps}
        >
            <div
                className={tailwind(
                    'w-full pt-6 pb-24 md:pb-10 px-4 sm:px-6 lg:px-10',
                    isBoxed && 'max-w-7xl mx-auto',
                    boxClassName,
                )}
            >
                {children}
            </div>
        </div>
    );
}
