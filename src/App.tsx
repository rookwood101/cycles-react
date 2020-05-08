import React from 'react';
import PercentageCircle from './PercentageCircle';
import PercentageCircleSVG from './PercentageCircleSVG';

export default class App extends React.PureComponent<{}, {percentage: number}>{
  public constructor(props: {}) {
    super(props);
    this.state = {
      percentage: 50,
    };
  }

  readonly #sliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ percentage: parseFloat(e.target.value) });
  }

  public render() {
    return (
      <div className="App">
        <PercentageCircle percent={this.state.percentage} />
        <PercentageCircleSVG percent={this.state.percentage} radius={25}/>
        <input type="range" min="0" max="100" onChange={this.#sliderChange}/>
      </div>
    );
  }
}