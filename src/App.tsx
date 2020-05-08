import React from 'react';
import PercentageCircle from './PercentageCircle';

export default class App extends React.PureComponent<{}, {percentage: number}>{
  public constructor(props: {}) {
    super(props);
    this.state = {
      percentage: 50,
    };
  }

  readonly #sliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ percentage: parseInt(e.target.value, 10) });
  }

  public render() {
    return (
      <div className="App">
        <PercentageCircle percent={this.state.percentage} />
        <input type="range" min="0" max="100" onChange={this.#sliderChange} />
      </div>
    );
  }
}