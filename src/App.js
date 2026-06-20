import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import QRGenerator from './components/QRGenerator';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/generate" component={QRGenerator} />
        <Route path="/q/:slug" component={ProfilePage} />
      </Switch>
    </Router>
  );
}

export default App;
