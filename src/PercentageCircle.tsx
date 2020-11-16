import React from 'react';
import useAnimationFrame from './useAnimationFrame';

interface PercentageCircleProps {
    percentage: number,
    radius: number,
    viewBox: number,
    strokeWidth: number,
    text: string,
    onMouseEnter: (event: React.MouseEvent<Element, MouseEvent>) => void,
    onMouseLeave: (event: React.MouseEvent<Element, MouseEvent>) => void,
}

const defaultStrokeColour = "lightgrey";
const hoverStrokeColour = "grey"

const tipCoordinate = (props: PercentageCircleProps): [number, number] => {
    const angle = props.percentage / 100 * 2 * Math.PI;
    const radius = props.radius;
    const xOffset = props.viewBox / 2;
    const yOffset = props.viewBox / 2;
    return [radius * Math.sin(angle) + xOffset, -radius * Math.cos(angle) + yOffset];
}

const circumference = (radius: number): number => {
    return 2 * Math.PI * radius;
}

const percentageStrokeDashArray = (props: PercentageCircleProps, animationPercentage: number): string => {
    const fractionOfCircumference = animationPercentage / 100 * circumference(props.radius);
    return `${fractionOfCircumference}, ${circumference(props.radius)}`;
}

const PercentageCircle: React.FC<PercentageCircleProps> = (props) => {
    const [strokeColour, setStrokeColour] = React.useState(defaultStrokeColour);
    const [animationPercentage, setAnimationPercentage] = React.useState(0);
    useAnimationFrame(deltaTime => {
        setAnimationPercentage(prev => Math.min(prev + deltaTime * 0.04, props.percentage));
    });

    const [tipX, tipY] = tipCoordinate(props);

    return (
        <g
            onMouseEnter={(event) => {setStrokeColour(hoverStrokeColour); props.onMouseEnter(event)}}
            onMouseLeave={(event) => {setStrokeColour(defaultStrokeColour); props.onMouseLeave(event)}}
        >
            <path
                d={`M ${props.viewBox/2} ${props.viewBox/2 - props.radius}
                    a ${props.radius} ${props.radius} 0 0 1 0 ${props.radius*2}
                    a ${props.radius} ${props.radius} 0 0 1 0 -${props.radius*2}`}
                fill="none"
                stroke={strokeColour}
                strokeWidth={props.strokeWidth}
                strokeDasharray={percentageStrokeDashArray(props, animationPercentage)}
                strokeLinecap="round"
            />
            <text
                x={tipX}
                y={tipY}
                style={{fontSize: "3px"}}
                dominantBaseline="middle"
                textAnchor="middle"
            >
                {props.text}
            </text>
        </g>
    );
};

export default PercentageCircle;
