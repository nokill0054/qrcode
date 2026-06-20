import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import QRGenerator from './components/QRGenerator';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={QRGenerator} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/q/:slug" component={ProfilePage} />
      </Switch>
    </Router>
  );
}

export default App; 