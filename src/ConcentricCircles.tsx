import React  from 'react';
import Task from './Task';
import TaskCircle from './TaskCircle';
import {clamp, distance} from 'popmotion'

interface ConcentricCirclesProps {
    showTaskDetail: (task: Task) => (() => void),
    hideTaskDetail: () => void,
}

const viewBox = 105;
const maxRadius = viewBox / 2;
const positionOffset = viewBox / 2;
const maxStrokeWidth = 3;

const distributeAlongCurve = (inputMin: number, inputMax: number, outputMin: number, outputMax: number, input: number): number => {
    return (input - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
}

const renderCircle = (props: ConcentricCirclesProps, task: Task, tasks: Task[], radiusOffset: number): React.ReactElement|null => {
    const radius = distributeAlongCurve(
        0,
        tasks.length - 1,
        1,
        maxRadius,
        tasks.indexOf(task),
    ) + radiusOffset;

    if (radius <= 0) {
        return null;
    }

    return (
        // TODO: implement click and drag to move circles
        <TaskCircle
            key={task.uuid}
            task={task}
            radius={radius}
            positionOffset={[positionOffset, positionOffset]}
            thickness={distributeAlongCurve(
                0,
                1,
                0.5,
                maxStrokeWidth,
                (task.regularity.asSeconds() - task.durationUntil().asSeconds()) / task.regularity.asSeconds(),
            )}
            onMouseEnter={props.showTaskDetail(task)}
            onMouseLeave={props.hideTaskDetail}
        />
    );
};

const domToSvgPoint = (svgElement: SVGSVGElement, [x, y]: [number, number]): [number, number] => {
    // https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
    const point = svgElement.createSVGPoint();
    point.x = x;
    point.y = y;
    const svgPoint = point.matrixTransform(svgElement.getScreenCTM()?.inverse());
    return [svgPoint.x, svgPoint.y]
}

const calculateRadiusOffsetDelta = (mouseMoveEvent: React.MouseEvent, previousMouseEvent: React.MouseEvent, svgElement: SVGSVGElement|null): number => {
    if (svgElement === null) {
        return 0;
    }

    const startXDom = previousMouseEvent.clientX;
    const startYDom = previousMouseEvent.clientY;
    const endXDom = mouseMoveEvent.clientX;
    const endYDom = mouseMoveEvent.clientY;

    const [startXSvg, startYSvg] = domToSvgPoint(svgElement, [startXDom, startYDom])
    const [endXSvg, endYSvg] = domToSvgPoint(svgElement, [endXDom, endYDom])
    const [centreXSvg, centreYSvg] = [positionOffset, positionOffset];

    const startToCentre = distance({x: startXSvg, y: startYSvg}, {x: centreXSvg, y: centreYSvg});
    const endToCentre = distance({x: endXSvg, y: endYSvg}, {x: centreXSvg, y: centreYSvg});
    
    const radiusOffsetDelta = endToCentre - startToCentre;

    return radiusOffsetDelta;
}

const ConcentricCircles: React.FC<ConcentricCirclesProps> = (props) => {
    const [tasks] = React.useState(
        Array.from(
            {length: 10},
            () => Task.randomTask()
        ).sort(
            (a, b) => a.regularity.asSeconds() - b.regularity.asSeconds()
        )
    );
    const [previousMouseEvent, setPreviousMouseEvent] = React.useState<React.MouseEvent|null>(null);
    const [radiusOffset, setRadiusOffset] = React.useState(0);

    const svgElement = React.useRef<SVGSVGElement|null>(null);

    const circles = tasks.map((task) => {
        return renderCircle(props, task, tasks, radiusOffset);
    });

    return (
        <svg
            ref={svgElement}

            viewBox={`0 0 ${viewBox} ${viewBox}`}
            onMouseDown={(event) => {
                if( event.button === 0) {
                    event.persist();
                    event.preventDefault();
                    setPreviousMouseEvent(event);
                }
            }}
            onMouseUp={(event) => {
                if (event.button === 0) {
                    setPreviousMouseEvent(null);
                }
            }}
            onMouseMove={(event) => {
                if (previousMouseEvent === null) {
                    return;
                }
                event.persist()
                setPreviousMouseEvent(event);
                const delta = calculateRadiusOffsetDelta(event, previousMouseEvent, svgElement.current) ;
                setRadiusOffset((prev) => {
                    return clamp(-maxRadius, maxRadius, prev + delta);
                });
            }}
        >
            {circles}
        </svg>
    );
};
export default ConcentricCircles;
