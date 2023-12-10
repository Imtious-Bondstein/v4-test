import React, { useEffect } from 'react';
import { useRouter } from "next/dist/client/router";
import LoadingScreen from '@/components/LoadingScreen';

const index = () => {
    const router = useRouter()
    useEffect(() => {
        router.push('/location/current-location')
    }, [])
    return (
        <div>
            <LoadingScreen />
        </div>
    );
};

export default index;