import React, { useEffect, useState, useCallback } from 'react';

import useInterval from '../hooks/useInterval';
import PomodoroTimer from './pomodoroTimer';
import Button from './button';
import { secondsToHours } from '../utils/getTimer';

import bellStart from '../sounds/bell-start.mp3';
import bellFinish from '../sounds/bell-finish.mp3';

const audioBellStart = new Audio(bellStart);
const audioBellFinish = new Audio(bellFinish);

export default function Home() {
    const [pomodoroTime, setPomodoroTime] = useState(0);
    const [restTime, setRestTime] = useState(0);
    const [cycles, setCycles] = useState(4);

    const totalCycles: boolean[] = new Array(cycles - 1).fill(true);

    const [mainTime, setMainTime] = useState(pomodoroTime);
    const [timeCounting, setTimeCounting] = useState(false);
    const [working, setWorking] = useState(false);
    const [resting, setResting] = useState(false);
    const [cyclesQtdManager, setCyclesQtdManager] = useState(totalCycles);

    const [completedCycles, setCompletedCycles] = useState(0);
    const [fullWorkingTime, setFullWorkingTime] = useState(0);
    const [numberPomodoros, setNumberPomodoros] = useState(0);

    useInterval(
        () => {
            setMainTime(mainTime - 1);
            if (working) setFullWorkingTime(fullWorkingTime + 1);
        },
        timeCounting ? 1000 : null
    );

    const configWork = useCallback(() => {
        setTimeCounting(true);
        setWorking(true);
        setResting(false);
        setMainTime(pomodoroTime * 60);
        audioBellStart.play();
    }, [setTimeCounting, setWorking, setResting, setMainTime, pomodoroTime]);

    const configRest = useCallback(
        (long: boolean) => {
            setTimeCounting(true);
            setWorking(false);
            setResting(true);

            if (long) {
                setMainTime(restTime * 60 * cycles);
            } else {
                setMainTime(restTime * 60);
            }

            audioBellFinish.play();
        },
        [setTimeCounting, setWorking, setResting, setMainTime, restTime, cycles]
    );

    useEffect(() => {
        if (working) document.body.classList.add('working');
        if (resting) document.body.classList.remove('working');

        if (mainTime > 0) return;

        if (working && cyclesQtdManager.length > 0) {
            configRest(false);
            cyclesQtdManager.pop();
        } else if (working && cyclesQtdManager.length <= 0) {
            configRest(true);
            setCyclesQtdManager(totalCycles);
            setCompletedCycles(completedCycles + 1);
        }

        if (working) setNumberPomodoros(numberPomodoros + 1);

        if (resting) configWork();
    }, [
        working,
        resting,
        mainTime,
        configRest,
        cyclesQtdManager,
        setNumberPomodoros,
        setCompletedCycles,
        numberPomodoros,
        completedCycles,
        configWork,
        totalCycles
    ]);

    return (
        <div className="pomodoro">
            <PomodoroTimer working={working} mainTime={mainTime} />

            <div className="controls">
                <Button
                    text={!working ? 'Começar' : 'Reiniciar'}
                    onClick={() => {
                        if (pomodoroTime == 0 || restTime === 0 || cycles === 0)
                            return;
                        configWork();
                    }}
                />
                <Button
                    className={!working && !resting ? 'hidden' : ''}
                    text={timeCounting ? 'Pausar' : 'Retornar'}
                    onClick={() => {
                        setTimeCounting(!timeCounting);
                    }}
                />
            </div>

            {timeCounting ? null : (
                <ul className="start-controls">
                    <li>
                        Tempo de trabalho:
                        <div className="input-container">
                            <input
                                type="text"
                                onChange={(e) => {
                                    setPomodoroTime(+e.target.value);
                                }}
                            />
                            min
                        </div>
                    </li>
                    <li>
                        Tempo de descanso curto:
                        <div className="input-container">
                            <input
                                type="text"
                                onChange={(e) => {
                                    setRestTime(+e.target.value);
                                }}
                            />
                            min
                        </div>
                    </li>
                    <li>
                        Número de ciclos:
                        <div className="input-container">
                            <input
                                type="text"
                                value={cycles}
                                onChange={(e) => {
                                    setCycles(+e.target.value);
                                }}
                            />
                        </div>
                    </li>
                </ul>
            )}

            <div className="details">
                <p>Ciclos concluídos: {completedCycles}</p>
                <p>Horas trabalhadas: {secondsToHours(fullWorkingTime)}</p>
                <p>Pomodoros concluídos: {numberPomodoros}</p>
            </div>
        </div>
    );
}
