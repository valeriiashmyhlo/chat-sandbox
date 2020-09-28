import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import EntryForm from './components/EntryForm/EntryForm';
import Chat from './components/Chat/Chat';
import styles from './App.module.scss';
import io from "socket.io-client";

const socket = io('http://localhost:8080', {
  transports: ['websocket'],
});

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      {isLoggedIn ? null : (
        <EntryForm
          className={cx(styles.entry, { hidden: isLoggedIn })}
          onSubmit={() => setLoggedIn(true)}
          socket={socket}
        />
      )}
      {isLoggedIn ? <Chat socket={socket} /> : null}
    </div>
  );
}

export default App;
