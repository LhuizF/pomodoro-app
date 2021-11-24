import React from 'react';
import { secondsToMin } from '../utils/getTimer';

interface Props {
    mainTimer: number;
}

export default function Timer(props: Props): JSX.Element {
    return <div className="timer">{secondsToMin(props.mainTimer)}</div>;
}
