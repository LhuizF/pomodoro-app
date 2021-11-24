import React from 'react';
import Timer from './timer';

interface Props {
    working: boolean;
    mainTime: number;
}

export default function PomodoroTimer(props: Props) {
    return (
        <div>
            <h2>Você esta: {props.working ? 'Trabalhando' : 'Descansando'}</h2>
            <Timer mainTimer={props.mainTime} />
        </div>
    );
}
