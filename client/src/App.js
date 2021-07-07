import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Hoe</Link>
          <Link to="/otherpage">Other Page</Link>
          <Route path="/" exact component={Fib} />
          <Route path="/otherpage" component={OtherPage} />
        </header>
      </div>
    </Router>
  );
}

export default App;
