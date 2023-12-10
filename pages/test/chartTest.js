import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea
} from 'recharts';

const chartTest = () => {
    const data = [
        { name: 1, cost: 4.11, impression: 100 },
        { name: 2, cost: 2.39, impression: 120 },
        { name: 3, cost: 1.37, impression: 150 },
        { name: 4, cost: 1.16, impression: 180 },
        { name: 5, cost: 2.29, impression: 200 },
        { name: 6, cost: 3, impression: 499 },
        { name: 7, cost: 0.53, impression: 50 },
        { name: 8, cost: 2.52, impression: 100 },
        { name: 9, cost: 1.79, impression: 200 },
        { name: 10, cost: 2.94, impression: 222 },
        { name: 11, cost: 4.3, impression: 210 },
        { name: 12, cost: 4.41, impression: 300 },
        { name: 13, cost: 2.1, impression: 50 },
        { name: 14, cost: 8, impression: 190 },
        { name: 15, cost: 0, impression: 300 },
        { name: 16, cost: 9, impression: 400 },
        { name: 17, cost: 3, impression: 200 },
        { name: 18, cost: 2, impression: 50 },
        { name: 19, cost: 3, impression: 100 },
        { name: 20, cost: 7, impression: 100 },
    ]
    const [refAreaLeft, setRefAreaLeft] = useState(null);
    const [refAreaRight, setRefAreaRight] = useState(null);

    const [state, setState] = useState({
        left: 'dataMin',
        right: 'dataMax',
        bottom: 'auto',
        top: 'auto',
        bottom2: 'auto',
        top2: 'auto',
    });

    const zoom = () => {
        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            setRefAreaRight(null);
            setRefAreaLeft(null);
            return;
        }

        const { left, right, bottom, top, bottom2, top2 } = state;

        setState({
            ...state,
            left: Math.min(refAreaLeft, refAreaRight),
            right: Math.max(refAreaLeft, refAreaRight),
            refAreaLeft: null,
            refAreaRight: null,
        });
    };

    const zoomOut = () => {
        // const { data } = this.props;
        setState({
            ...state,
            left: 'dataMin',
            right: 'dataMax',
            refAreaLeft: null,
            refAreaRight: null,
            bottom: 'auto',
            top: 'auto',
            bottom2: 'auto',
            top2: 'auto',
        });
    };

    return (
        <div className="highlight-bar-charts" style={{ userSelect: 'none', width: '100%' }}>
            <button type="button" className="btn update" onClick={zoomOut}>
                Zoom Out
            </button>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    width={800}
                    height={400}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
                    onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
                    onMouseUp={zoom}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis allowDataOverflow dataKey="name" domain={[state.left, state.right]} type="number" />
                    <YAxis allowDataOverflow domain={[state.bottom, state.top]} type="number" yAxisId="1" />
                    <YAxis orientation="right" allowDataOverflow domain={[state.bottom2, state.top2]} type="number" yAxisId="2" />
                    <Tooltip />
                    <Line yAxisId="1" type="natural" dataKey="cost" stroke="#8884d8" animationDuration={300} />
                    <Line yAxisId="2" type="natural" dataKey="impression" stroke="#82ca9d" animationDuration={300} />

                    {refAreaLeft && refAreaRight ? (
                        <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                    ) : null}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default chartTest;
