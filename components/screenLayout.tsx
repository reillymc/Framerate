import type { FC, ReactNode } from "react";

interface ScreenLayoutProps {
    meta?: ReactNode;
    isLoading?: boolean;
    isErrored?: boolean;
    isEmpty?: boolean;
    loading?: ReactNode;
    errored?: ReactNode;
    empty?: ReactNode;
    children: ReactNode;
}

export const ScreenLayout: FC<ScreenLayoutProps> = ({
    meta,
    empty,
    errored,
    loading,
    children,
    isEmpty,
    isErrored,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <>
                {meta}
                {loading}
            </>
        );
    }

    if (isErrored) {
        return (
            <>
                {meta}
                {errored}
            </>
        );
    }

    if (isEmpty) {
        return (
            <>
                {meta}
                {empty}
            </>
        );
    }

    return (
        <>
            {meta}
            {children}
        </>
    );
};
