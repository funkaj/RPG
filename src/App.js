import React, { Component } from 'react';
import Game from './game/world';

class App extends Component {
	render() {
		return (
			<div>
				<Game className='gameDiv' />
			</div>
		);
	}
}

export default App;
