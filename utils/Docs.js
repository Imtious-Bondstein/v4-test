import React from "react";

const Docs = () => {
  analytics_summary = {
    traveled_distance: [
      {
        date: "Sun 18 jan",
        distance: 50,
        vehiclesNumber: 2,
      },
    ],

    total_number_of_vehicles: {
      totalCount: 25,
      data: [
        { value: 6, name: "Live" },
        { value: 2, name: "Suspended" },
        { value: 8, name: "Offline" },
        { value: 3, name: "Parking" },
        { value: 6, name: "Workshop" },
      ],
    },

    seven_days_alert_summury: [
      {
        date: "5 Jan 2023",
        trips: 23,
        speeding: 10,
        fenceOut: 9,
      },
    ],

    trips: {
      totalCount: 35,
      data: [
        {
          name: "18 Jan",
          Trips: 7,
        },
      ],
    },
  };

  vehicleProfile = [
    {
      sl: 1,
      vehicleNo: {
        image: "bike.png",
        bstid: "TMV 28281",
        name: "DM LA 118-4479",
      },
      brand: "suzuki",
      model: "gixxer",
      type: "bike",
      color: {
        colorCode: "#FF6B6B",
        colorName: "Red",
      },
      engineNo: "1234567890",
      chessisNo: "1234567890",
      fuelCapacity: "15.00 Ltr",
      loadCapacity: "2 Ton",
      group: "HR & Studio",
      driver: "Anis Mia",
      owner: "Fazle Rabbi",
      vendor: "Fazle Rabbi",
      status: "red",
    },
  ];

  deviceDetails = [
    {
      sl: 1,
      bstid: "TMV 28281",
      vehicleName: "DM LA 118-4479 Bikee",
      installedOn: "05 Jan 2023",
      warranty: "18 Dec 2025",
      sim: "01875-536988",
      lastSeen: "5 Jan 2023 | 2:33 pm",
    },
    {
      sl: 2,
      bstid: "TMV 28282",
      vehicleName: "DM LA 118-4479 Bike",
      installedOn: "05 Jan 2023",
      warranty: "18 Dec 2025",
      sim: "01875-536988",
      lastSeen: "5 Jan 2023 | 2:33 pm",
    },
  ];

  alertManagement = [
    {
      sl: 1,
      bstid: "TMV 28281",
      vehicleName: "DM LA 118-4479 Bikee",
      engineOn: { email: true, sms: true },
      engineOff: { email: true, sms: false },
      overspeed: { email: false, sms: true },
      speed: 60,
      Panic: { email: true, sms: false },
      offline: { email: true, sms: false },
      disconnect: { email: true, sms: true },
    },
    {
      sl: 2,
      bstid: "TMV 38282",
      vehicleName: "DM LA 118-4479 Bikee",
      engineOn: { email: true, sms: true },
      engineOff: { email: true, sms: false },
      overspeed: { email: false, sms: true },
      speed: 60,
      Panic: { email: true, sms: false },
      offline: { email: true, sms: false },
      disconnect: { email: true, sms: true },
    },
  ];

  overspeedAlert = [
    {
      sl: 1,
      bstid: "TMV 28281",
      vehicleName: "DM LA 118-4479 Bikee",
      dateTime: "5 Jan 2023 | 2:33 pm",
      speed: 60,
      car: {
        type: "car",
        image: "car.png",
      },
    },
    {
      sl: 2,
      bstid: "TMV 48283",
      vehicleName: "DM LA 118-4479 Bikee",
      dateTime: "5 Jan 2023 | 2:33 pm",
      speed: 70,
      car: {
        type: "cng",
        image: "cng.png",
      },
    },
  ];

  fatigueAlert = [
    {
      sl: 1,
      bstid: "TMV 28281",
      vehicleName: "DM LA 118-4479 Bikee",
      fromLocation: {
        location: "Uttar Begun Bari Road",
        dateTime: "5 Jan 2023 | 2:33 pm",
      },
      toLocation: {
        location: "Nikunja 2",
        dateTime: "5 Jan 2023 | 2:33 pm",
      },
      duration: "00.00.00",
    },
    {
      sl: 2,
      bstid: "TMV 38282",
      vehicleName: "DM LA 118-4479 Bikee",
      fromLocation: {
        location: "Uttar Begun Bari Road",
        dateTime: "5 Jan 2023 | 2:33 pm",
      },
      toLocation: {
        location: "Nikunja 2",
        dateTime: "5 Jan 2023 | 2:33 pm",
      },
      duration: "03.17.56",
    },
  ];

  offlineAlert = [
    {
      sl: 1,
      bstid: "TMV 28281",
      vehicleName: "DM LA 118-4479 Bikee",
      lastOnlineTime: "5 Jan 2023 | 2:33 pm",
      car: {
        type: "car",
        image: "car.png",
      },
    },
    {
      sl: 2,
      bstid: "TMV 38282",
      vehicleName: "DM LA 118-4479 Bikee",
      lastOnlineTime: "5 Jan 2023 | 2:33 pm",
      car: {
        type: "bike",
        image: "bike.png",
      },
    },
  ];

  panicAlert = [
    {
      sl: 1,
      bstid: "TMV 28281",
      vehicleName: "DM LA 118-4479 Bikee",
      dateTime: "5 Jan 2023 | 2:33 pm",
      car: {
        type: "car",
        image: "car.png",
      },
    },
    {
      sl: 2,
      bstid: "TMV 38282",
      vehicleName: "DM LA 118-4479 Bikee",
      dateTime: "5 Jan 2023 | 2:33 pm",
      car: {
        type: "bike",
        image: "bike.png",
      },
    },
  ];

  disconnectionAlert = [
    {
      sl: 1,
      bstid: "TMV 28281",
      vehicleName: "DM LA 118-4479 Bikee",
      lastOnlineTime: "5 Jan 2023 | 2:33 pm",
      car: {
        type: "cng",
        image: "cng.png",
      },
    },
    {
      sl: 2,
      bstid: "TMV 38282",
      vehicleName: "DM LA 118-4479 Bikee",
      lastOnlineTime: "5 Jan 2023 | 2:33 pm",
      car: {
        type: "bike",
        image: "bike.png",
      },
    },
  ];

  alertSummury = [
    {
      sl: 1,
      vehicleCode: "TMV 28281",
      disconnect: 01,
      engineOn: 05,
      engineOff: 06,
      panic: 04,
      overspeed: 02,
      harshBrake: 09,
      parkingExit: 01,
      fenceEntry: 01,
      fenceExist: 04,
      total: 150,
    },
    {
      sl: 2,
      vehicleCode: "TMV 38282",
      disconnect: 02,
      engineOn: 06,
      engineOff: 07,
      panic: 05,
      overspeed: 03,
      harshBrake: 02,
      parkingExit: 08,
      fenceEntry: 09,
      fenceExist: 06,
      total: 160,
    },
  ];

  hourlyReport = [
    {
      date: "1 January, 2023",
      hourStart: "00:00:00",
      hourEnd: "00:00:00",
      maximumSpeed: "60 Km/H",
      minimumSpeed: "10 Km/H",
      distance: "60 KM",
    },
  ];

  dailyReport = [
    {
      date: "1 January, 2023",
      startTime: "00:00:00",
      endTime: "00:00:00",
      duration: "6:33:00",
      distance: "60 KM",
    },
  ];

  speedReport = [
    {
      time: "6:33:00",
      speed: "60 KM",
    },
  ];
  engineReport = [
    {
      from: "1 January, 2023",
      to: "7 July, 2023 | 5:56 pm",
      duration: "09:33:00",
      status: "Low",
    },
  ];
};

export default Docs;
