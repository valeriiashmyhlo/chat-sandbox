import React, { useState } from 'react';
import cx from 'classnames';
import EntryForm from './components/EntryForm/EntryForm';
import Chat from './components/Chat/Chat';
import './App.css';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      {isLoggedIn ? null : (
        <EntryForm
          className={cx({ hidden: isLoggedIn })}
          onSubmit={() => setLoggedIn(true)}
        />
      )}
      {isLoggedIn ? <Chat /> : null}
    </div>
  );
}

export default App;
