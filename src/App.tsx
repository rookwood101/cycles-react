import React from 'react';
import ConcentricCircles from './ConcentricCircles';

export default class App extends React.PureComponent<{}, {percentage: number}>{
  private lastFrameTime: number;

  public constructor(props: {}) {
    super(props);
    this.state = {
      percentage: 0,
    };
    this.lastFrameTime = performance.now();
  }

  public componentDidMount(): void {
    requestAnimationFrame(this.#increment);
  }

  readonly #increment = (): void => {
    const currentFrameTime = performance.now();
    const deltaTime = currentFrameTime - this.lastFrameTime;
    this.lastFrameTime = currentFrameTime;

    this.setState({percentage: this.state.percentage % 100 + 0.01*deltaTime});
    requestAnimationFrame(this.#increment);
  }

  readonly #sliderChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    this.setState({ percentage: e.currentTarget.valueAsNumber });
  }

  public render() {
    return (
      <div className="App">
        <ConcentricCircles percentage={this.state.percentage}/>
        <input type="range" min="0" max="100" step="0.01"
               style={{width: "calc(100% - 6px)"}}
               onMouseDown={this.#sliderChange} onChange={this.#sliderChange}
               value={this.state.percentage}/>
      </div>
    );
  }
}