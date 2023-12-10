// import SpeedometerTest from '@/components/SpeedometerTest';
import React from 'react';

import dynamic from "next/dynamic";
import Speedometer from '@/components/Speedometer';
const SpeedometerTest = dynamic(
    () => import("@/components/test/SpeedometerTest"),
    {
        ssr: false,
    }
);

const meterTest = () => {
    return (
        <div>
            <SpeedometerTest />

        </div>
    );
};

export default meterTest;