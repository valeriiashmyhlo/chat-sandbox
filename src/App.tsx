import React, { useState, useEffect, useReducer } from 'react';
import EntryForm from './components/EntryForm/EntryForm';
import Chat from './components/Chat/Chat';
import styles from './App.module.scss';
import io from 'socket.io-client';
import { User, Message, Optional } from 'types';

const socket = io('http://localhost:8080', {
  transports: ['websocket'],
});

const usersReducer = (users: { [key: string]: User }, newUsers: User[]): { [key: string]: User } => {
  for (let user of newUsers) {
    users = { ...users, [user.id]: user };
  }

  return users;
};

function App() {
  const [user, setUser] = useState<Optional<User>>(null);
  const [users, setUsers] = useReducer(usersReducer, {});
  const [messageHistory, setMsgHistory] = useState<Message[]>([]);

  useEffect(() => {
    socket.on(
      'signInSuccess',
      ({ user, users, messageHistory }: { user: User; users: User[]; messageHistory: Message[] }) => {
        setUser(user);
        setUsers(users);
        setMsgHistory(messageHistory);
      }
    );

    socket.on('userJoined', (user: User) => {
      setUsers([user]);
    });
  });

  console.log(messageHistory);

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
