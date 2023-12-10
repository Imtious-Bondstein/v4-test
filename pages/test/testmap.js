import React from 'react';
import dynamic from 'next/dynamic';


// const MapBoundary = dynamic(() => import('@/components/test/mapBoundary'), {
//     ssr: false,
// })
const TestMap = dynamic(() => import('@/components/test/TestMap'), {
    ssr: false,
})

const testmap = () => {
    return (
        <div>
            {/* <TestMap /> */}
            {/* <MapBoundary /> */}
        </div>
    );
};

export default testmap;