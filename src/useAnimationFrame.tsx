// From https://css-tricks.com/using-requestanimationframe-with-react-hooks/
import React from 'react'

type DeltaTimeCallback = (deltaTime: number, totalTime: number) => void;

const useAnimationFrame = (callback: DeltaTimeCallback) => {
	// Use useRef for mutable variables that we want to persist
	// without triggering a re-render on their change
	const requestRef: React.MutableRefObject<number | null> = React.useRef(null);
	const previousTimeRef = React.useRef(performance.now());
	const totalTimeRef = React.useRef(0);

	const animate = React.useCallback((time: number) => {
		const deltaTime = time - previousTimeRef.current;
		const totalTime = totalTimeRef.current + deltaTime;
		callback(deltaTime, totalTime)
		totalTimeRef.current = totalTime;
		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	}, [previousTimeRef, requestRef, callback]);

	React.useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => {
				if (requestRef.current !== null) {
						cancelAnimationFrame(requestRef.current);
				}
		}
	}, [animate]); // Make sure the effect runs only once
}

export default useAnimationFrame;
