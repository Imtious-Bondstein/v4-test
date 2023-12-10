import Link from 'next/link';
import React, { useState } from 'react';
import car_1 from '../public/cars/carT-1.png'
import map_markers from '../public/info/mapMarkers.png'
import CustomToolTip from './CustomToolTip';
import ClockSVG from './SVG/mapInfoSvg/ClockSVG';
import EngineOnSVG from './SVG/EngineOnSVG';
import EngineReportSVG from './SVG/mapInfoSvg/EngineReportSVG';
import LocationSVG from './SVG/mapInfoSvg/LocationSVG';
import RouteSVG from './SVG/mapInfoSvg/RouteSVG';
import SpeedMeterSVG from './SVG/mapInfoSvg/SpeedMeterSVG';
import TimeSVG from './SVG/TimeSVG';
import SpeedMeter from './SpeedMeter';
import SupportSVG from '@/svg/menu/SupportSVG';
import Image from 'next/image';
import MapSVG from './SVG/MapSVG';

const VehicleInfoWindow = ({ status, speed }) => {
    const [isParking, setIsParking] = useState(false);
    const [isInGarage, setIsInGarage] = useState(false);

    const handleParking = () => {
        setIsParking(true)
    }

    const handleInGarage = () => {
        setIsInGarage(true)
    }

    const handleRaiseSupportTicket = () => {
        console.log('raising.......');
    }

    return (
        <div className='w-96 p-2 text-xs flex-col'>
            {/* header */}
            <div className='flex items-center justify-center space-x-2 rounded p-1 bg-primary mb-1.5'>
                <div className='text-right'>
                    <p className='font-bold'>TMV 24555</p>
                    <p>DM LA 118-4479</p>
                </div>
                {/* <img src={car_1.src} className="" alt="" /> */}
                <Image src={car_1} />
                <div className='text-left'>
                    <p className='font-bold'>Vehicle_name</p>
                    <p>User_Name</p>
                </div>
            </div>
            {/* body */}
            <div className='grid grid-cols-2 gap-1.5 mb-1.5'>
                <div className='bg-secondary rounded p-2'>
                    {status === 'offline' ?
                        <div className='h-full'>
                            {!isParking ?
                                <div className='flex flex-col justify-between h-full'>
                                    <p>
                                        This car's tracker appears to be offline. Is it inside a shaded parking?
                                    </p>
                                    <div className='flex items-center space-x-3'>
                                        <button className='w-full bg-primary rounded py-1'>Yes</button>
                                        <button onClick={handleParking} className='w-full bg-white rounded py-1'>No</button>
                                    </div>
                                </div>
                                :
                                <div className='h-full'>
                                    {!isInGarage ?
                                        <div className='flex flex-col justify-between h-full'>
                                            <p>
                                                Is it in a garage for maintenance?
                                            </p>
                                            <div className='flex items-center space-x-3 mt-2'>
                                                <button className='w-full bg-primary rounded py-1'>Yes</button>
                                                <button onClick={handleInGarage} className='w-full bg-white rounded py-1'>No</button>
                                            </div>
                                        </div>
                                        :
                                        <div className='flex flex-col justify-between h-full'>
                                            <p>
                                                This car's tracker appears to be offline. Please raise a support ticket.
                                            </p>
                                            <button onClick={handleRaiseSupportTicket} className='w-full bg-primary rounded py-1 flex items-center space-x-2 mt-1.5 px-2.5'>
                                                <SupportSVG />
                                                <span className='font-normal'>Raise Support Ticket</span>
                                            </button>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        :
                        <SpeedMeter speed={speed} />
                    }
                </div>

                <div className='bg-secondary rounded p-2'>
                    <p>
                        Uttar Begun Bari Road <br />
                        Tejgaon (0.07 KM) <br />
                        23.85891, 90.41850
                    </p>
                    {/* <img src={map_markers.src} className="" alt="" /> */}
                    <MapSVG />
                </div>
            </div>
            {/* status  */}
            <div className='grid grid-cols-2 gap-2 mb-1.5'>
                <div className='bg-[#50BFA514] p-2 rounded flex items-center space-x-2'>
                    <EngineOnSVG />
                    <p>Engine Status: On</p>
                </div>
                <div className='bg-secondary p-2 rounded flex items-center space-x-2'>
                    <TimeSVG />
                    <p>2:35 PM, 03 Jan, 2023</p>
                </div>
            </div>

            {/* status link */}
            <div className='grid grid-cols-5 gap-1.5'>
                <LocationSVG />
                <ClockSVG />
                <EngineReportSVG />
                <SpeedMeterSVG />
                <RouteSVG />
            </div>

            <div className='mt-1'>
                <p className='text-right text-[10px] text-gray-400'>last engine on: 31 Dec, 2023, 2:12 PM</p>
            </div>
        </div>
    );
};

export default VehicleInfoWindow;
