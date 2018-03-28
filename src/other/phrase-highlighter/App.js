import React, { Component } from 'react';
import TextSentimentAnalyzer from './components/TextSentimentAnalyzer';
import './index.css';

class App extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      text: 'Most people would say that i\'m freaking awesome, athletic, and look a little bit like John F Kennedy Jr. I have an adorable puppy named Atticus, based on the famous character in To Kill A Mocking Bird.',
    };
  }

  _handleTextChange = (e) => {
    this.setState({
      text: e.target.value,
    });
  }

  render() {
    const { text } = this.state;

    return (
      <div className="App">
        <h1>Phrase Highlighter</h1>

        <TextSentimentAnalyzer
          text={text}
        />

        <hr />

        <textarea
          onChange={this._handleTextChange}
          type="textarea"
          value={text}
        />
      </div>
    );
  }
}

export default App;
