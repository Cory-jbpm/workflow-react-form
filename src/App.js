import React from 'react';
import SForm from './SForm';
import './App.css';
import { Helmet } from 'react-helmet';

class App extends React.Component {

  render() {
      return (
        <div className="App">
      <Helmet>
          <title>Serverless Workflow Form</title>
          <meta charset="utf-8"/>
          <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" id="theme" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"/>
        </Helmet>
      <SForm/>
    </div>
    );
}
}

export default App;

