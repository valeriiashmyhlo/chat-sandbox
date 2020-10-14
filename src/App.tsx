import React, { useState, useEffect, useReducer } from 'react';
import EntryForm from './components/EntryForm/EntryForm';
import Chat from './components/Chat/Chat';
import styles from './App.module.scss';
import io from 'socket.io-client';
import { User, Message, Optional } from 'types';

const socket = io('http://localhost:8080', {
  transports: ['websocket'],
});

type UsersState = { [key: string]: User };

const usersReducer = (state: UsersState, users: User[]): UsersState => {
  const updatedUsers = { ...state };

  for (const user of users) {
    updatedUsers[user.id] = user
  }

  return updatedUsers;
}

function App() {
  const [user, setUser] = useState<Optional<User>>(null);
  const [users, setUsers] = useReducer(usersReducer, {});
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  useEffect(() => {
    socket.on(
      'signInSuccess',
      ({ user, users, messageHistory }: { user: User; users: User[]; messageHistory: Message[] }) => {
        setUser(user);
        setUsers(users);
        setMessageHistory(messageHistory);
      }
    );
  });

  return (
    <div className="App">
      {user ? (
        <Chat socket={socket} user={user} users={users} msgHistory={messageHistory} />
      ) : (
        <EntryForm className={styles.entry} socket={socket} />
      )}
    </div>
  );
}

export default App;
