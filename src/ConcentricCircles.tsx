import React  from 'react';
import Task from './Task';
import TaskCircle from './TaskCircle';
import {clamp, distance} from 'popmotion'
import useAnimationFrame from './useAnimationFrame';

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
    let radius = distributeAlongCurve(
        0,
        tasks.length - 1,
        1,
        maxRadius,
        tasks.indexOf(task),
    ) + radiusOffset;

    if (radius <= 0) {
        // return null;
        radius = 0;
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

const calculateRadiusOffsetDelta = (start: PointerEvent, end: PointerEvent, svgElement: SVGSVGElement|null): number => {
    if (svgElement === null) {
        return 0;
    }
    const startXDom = start.clientX;
    const startYDom = start.clientY;
    const endXDom = end.clientX;
    const endYDom = end.clientY;

    const [startXSvg, startYSvg] = domToSvgPoint(svgElement, [startXDom, startYDom]);
    const [endXSvg, endYSvg] = domToSvgPoint(svgElement, [endXDom, endYDom]);
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
    const previousMouseEvent = React.useRef<PointerEvent|null>(null);
    const [radiusOffset, setRadiusOffset] = React.useState(0);

    // coasting animation
    const velocity = React.useRef(0);
    const friction = 0.0001;

    useAnimationFrame(deltaTime => {
        const initialDirection = Math.sign(velocity.current);
        velocity.current -= Math.sign(velocity.current) * friction * deltaTime;
        const newDirection = Math.sign(velocity.current);
        if (initialDirection !== newDirection) {
            velocity.current = 0;
        }
        const currentVelocity = velocity.current;
        setRadiusOffset((prev) => {
            const beforeClamp = prev + deltaTime * currentVelocity;
            const newRadiusOffset = clamp(-maxRadius, maxRadius, beforeClamp);
            return newRadiusOffset;
        });
    });

    const svgElement = React.useRef<SVGSVGElement|null>(null);

    const onPointerDown = (event: PointerEvent) => {
        if (event.button === 0) {
            event.preventDefault();
            previousMouseEvent.current = event;
            velocity.current = 0;
        }
    };
    const onPointerUp = (event: PointerEvent) => {
        if (event.button === 0) {
            previousMouseEvent.current = null;
        }
    };
    const onPointerMove = (event: PointerEvent) => {
        if (previousMouseEvent.current === null) {
            return;
        }
        event.preventDefault();
        const _delta = calculateRadiusOffsetDelta(previousMouseEvent.current, event, svgElement.current);
        previousMouseEvent.current = event;
        // setRadiusOffset((prev) => {
        //     return clamp(-maxRadius, maxRadius, prev + _delta);
        // });
        velocity.current += _delta * 0.01;
    };

    React.useEffect(() => {
        document.body.addEventListener("pointerdown", onPointerDown);
        document.body.addEventListener("pointerup", onPointerUp);
        document.body.addEventListener("pointermove", onPointerMove);

        return function cleanup() {
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointermove", onPointerMove);
        } 
    }, [])


    const circles = tasks.map((task) => {
        return renderCircle(props, task, tasks, radiusOffset);
    });

    return (
        <svg
            ref={svgElement}
            viewBox={`0 0 ${viewBox} ${viewBox}`}
            
        >
            {circles}
        </svg>
    );
};
export default ConcentricCircles;
