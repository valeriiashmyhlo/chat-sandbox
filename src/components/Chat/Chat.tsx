import React, { FC, FormEvent, useEffect, useState } from 'react';
import io from 'socket.io-client';
import cx from 'classnames';
import styles from '../Chat/Chat.module.scss';
import BasicForm from '../BasicForm/BasicForm';

const socket = io('http://localhost:8080', {
  transports: ['websocket'],
});

interface Message {
  id: string;
  message: string;
}

interface Messages {
  key: Message;
}

type Optional<I> = I | null;

interface User {
  id: number;
  username: string;
}

const Chat: FC<{ className?: string }> = (props) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<Optional<User>>(null);

  useEffect(() => {
    socket.on('new user', (user: User) => {
      setUser(user);
    });

    socket.on('new message', (data: any) => {
      setMessages((prevState) => [...prevState, data]);
    });
  }, []);

  const handleSubmit = (e: FormEvent) => {
    // fetch('http://localhost:8080', {
    //   method: 'GET'
    // });

    socket.emit('new message', message);
  };

  return (
    <div className={styles.chat}>
      <div>
        {messages.map((m: Message) => (
          <div key={m.id}>{m.message}</div>
        ))}
      </div>
      <BasicForm
        className={cx(styles.form, props.className)}
        formName="chatForm"
        handleSubmit={handleSubmit}
        inputName="message"
        message="Please enter your message!"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );
};

export default Chat;
