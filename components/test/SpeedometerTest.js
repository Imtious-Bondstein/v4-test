import React, { useEffect, useState } from 'react';
import '@/styles/components/meter.css'
import Speedometer from '../Speedometer';
import { SpeedTest } from './SpeedTest';

const SpeedometerTest = () => {
    const [speed, setSpeed] = useState([20, 30, 40, 50, 60, 100, 150, 80, 60, 20, 30])
    const [currentSpeed, setCurrentSpeed] = useState(0)

    useEffect(() => {
        const timeouts = [];
        speed.forEach((speedValue, index) => {
            const timeout = setTimeout(() => {
                setCurrentSpeed(speedValue);
            }, index * 2000);
            timeouts.push(timeout);
        });

        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout));
        };
    }, [speed]);

    return (
        <>
            <div>
                <Speedometer value={currentSpeed} />
                <SpeedTest />

                {/* <GaugeChart id="gauge-chart6"
                    animate={false}
                    textColor="#000"
                    nrOfLevels={currentSpeed}
                    needleColor="#345243"
                /> */}
            </div>
        </>
    );
};

export default SpeedometerTest;