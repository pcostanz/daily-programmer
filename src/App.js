import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import './App.css';



import Container from './reddit/353-closest-string/Container';
import Highlighter from './other/phrase-highlighter/App';

class App extends React.Component {
  render() {

    return <Container />;
    return (
      <div>
        <div>
          <Link to="/353-closest-string">Closest String</Link>
          <Link to="/phrase-highlighter">Phrase Highlighter</Link>
        </div>
        <div>
          <Route path="/353-closest-string" component={Container} />
          <Route path="/phrase-highlighter" component={Highlighter} />
        </div>
      </div>
    );
  }
}

export default App;
