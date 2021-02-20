import { FunctionalComponent, h } from 'preact';
import { keyframes, cubicBezier, Animation } from 'popmotion';
import useAnimationFrame from './useAnimationFrame';
import { useState } from 'preact/hooks';

interface PercentageCircleProps {
    percentage: number,
    radius: number,
    positionOffset: [number, number],
    thickness: number,
    text: string,
    onMouseEnter: () => void,
    onMouseLeave: () => void,
    onMouseDown: () => void,
}

const defaultStrokeColour = "lightgrey";
const hoverStrokeColour = "grey";
const selectedStrokeColour = "darkgrey";

const tipCoordinate = (props: PercentageCircleProps, percentage: number): [number, number] => {
    const angle = percentage / 100 * 2 * Math.PI;
    const radius = props.radius;
    const [xOffset, yOffset] = props.positionOffset;
    return [radius * Math.sin(angle) + xOffset, -radius * Math.cos(angle) + yOffset];
}

const circumference = (radius: number): number => {
    return 2 * Math.PI * radius;
}

const percentageStrokeDashArray = (props: PercentageCircleProps, percentage: number): string => {
    const fractionOfCircumference = percentage / 100 * circumference(props.radius);
    return `${fractionOfCircumference}, ${circumference(props.radius)}`;
}

const makePercentageAnimation = (target: number): Animation<number | string> => {
    return keyframes<number>({
        from: 0,
        to: target,
        duration: 2000,
        ease: cubicBezier(.4,0,.4,1),
    });
}

const PercentageCircle: FunctionalComponent<PercentageCircleProps> = (props) => {
    console.log("rerender");
    const [strokeColour, setStrokeColour] = useState(defaultStrokeColour);

    const percentageAnimation = makePercentageAnimation(props.percentage);
    const [animationPercentage, setAnimationPercentage] = useState(0);
    useAnimationFrame((_deltaTime, totalTime) => {
        const nextAnimationPercentage = percentageAnimation.next(totalTime);
        setAnimationPercentage(Number(nextAnimationPercentage.value));
    });

    const [tipX, tipY] = tipCoordinate(props, animationPercentage);
    const [xOffset, yOffset] = props.positionOffset;

    return (
        <g
            onPointerEnter={() => {setStrokeColour(hoverStrokeColour); props.onMouseEnter()}}
            onPointerLeave={() => {setStrokeColour(defaultStrokeColour); props.onMouseLeave()}}
            onPointerUp={props.onMouseDown}
        >
            <path
                d={`M ${xOffset} ${yOffset - props.radius}
                    a ${props.radius} ${props.radius} 0 0 1 0 ${props.radius*2}
                    a ${props.radius} ${props.radius} 0 0 1 0 -${props.radius*2}`}
                fill="none"
                stroke={strokeColour}
                stroke-width={props.thickness}
                stroke-dasharray={percentageStrokeDashArray(props, animationPercentage)}
                stroke-linecap="round"
            />
            <text
                x={tipX}
                y={tipY}
                style={{fontSize: "3px", userSelect: "none"}}
                dominant-baseline="middle"
                text-anchor="middle"
            >
                {props.text}
            </text>
        </g>
    );
};

export default PercentageCircle;
