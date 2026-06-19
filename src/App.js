import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import QRGenerator from './components/QRGenerator';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={QRGenerator} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default App; 