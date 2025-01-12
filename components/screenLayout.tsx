import type { FC, ReactNode } from "react";

interface ScreenLayoutProps {
    meta?: ReactNode;
    isLoading?: boolean;
    isErrored?: boolean;
    isEmpty?: boolean;
    isSearching?: boolean;
    loading?: ReactNode;
    errored?: ReactNode;
    empty?: ReactNode;
    search?: ReactNode;
    children: ReactNode;
}

export const ScreenLayout: FC<ScreenLayoutProps> = ({
    meta,
    empty,
    errored,
    loading,
    search,
    children,
    isEmpty,
    isErrored,
    isLoading,
    isSearching,
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

    if (isSearching) {
        return (
            <>
                {meta}
                {search}
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
