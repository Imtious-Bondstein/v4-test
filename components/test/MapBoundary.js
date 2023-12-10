import React, { useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 23.8221934,
    lng: 90.4219536,
};


const mapBoundary = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDGCiFRpeVsZEiztcpjt-h_dlEg5tsUZLQ'
    });


    const [map, setMap] = useState(null);

    const [selectedVehicles, setSelectedVehicles] = useState([
        {
            device_status: null,
            engine_status: true,
            id: 261899,
            identifier: "357789642822420",
            isInfoShowing: true,
            latitude: 23.762887954742,
            longitude: 90.406814575197,
            nearby_l_name: null,
            speed_status: "0",
            time_inserted: "2023-04-17 15:52:36",
            v_group: "Group 1",
            v_username: "Asif Kibria",
            v_vrn: "32423432"
        },
        // {
        //     device_status: null,
        //     engine_status: true,
        //     id: 261899,
        //     identifier: "357789642822420",
        //     isInfoShowing: true,
        //     latitude: 23.762887954712,
        //     longitude: 90.406814575195,
        //     nearby_l_name: null,
        //     speed_status: "0",
        //     time_inserted: "2023-04-17 15:52:36",
        //     v_group: "Group 1",
        //     v_username: "Asif Kibria",
        //     v_vrn: "32423432"
        // },
    ])

    // When the map loads, set the map object to state
    const onLoad = (map) => {
        setMap(map);
    };

    // Create a LatLngBounds object from the current map bounds
    const getBounds = () => {
        if (map) {
            const bounds = map.getBounds();
            return bounds;
        }
        return null;
    };



    return <div>
        {
            isLoaded ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={2}
                    onLoad={onLoad}
                >
                    {/* boundary  */}
                    {selectedVehicles.map((vehicle) => {
                        const { latitude, longitude } = vehicle;
                        const position = { lat: latitude, lng: longitude };
                        const bounds = getBounds();

                        console.log('bounds:--*', bounds);
                        // Check if the vehicle is within the current map bounds
                        if (bounds && bounds.contains(position)) {
                            return <Marker position={{ lat: latitude, lng: longitude }} />;
                        }
                        return null;

                    })}
                </GoogleMap>
            ) : null
        }
    </div>
};

export default mapBoundary;
