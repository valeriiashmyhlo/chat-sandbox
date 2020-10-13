import React, { FC, FormEvent, useEffect, useState, useReducer } from 'react';
import cx from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import styles from '../Chat/Chat.module.scss';
import BasicForm from '../BasicForm/BasicForm';
import { Message, User } from 'types';

interface ChatProps {
  className?: string;
  user: User;
  users: { [key: string]: User };
  msgHistory: Message[];
  socket: {
    emit(newUser: string, values: { userId: string; message: string }): void;
    on(newUser: string, param2: (data: any) => void): void;
  };
}

const Chat: FC<ChatProps> = ({ socket, className, user, users, msgHistory }) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('userJoined', (joinedUser: User) => {
      const userJoinedMsg = {
        userId: joinedUser.id,
        id: uuidv4(),
        message: `${joinedUser.name} joined the chat`,
        isUserMsg: true,
      };

      setMessages((prevState) => [...prevState, userJoinedMsg]);
    });

    socket.on('newMessage', (msg: Message) => setMessages((prevState) => [...prevState, msg]));

    socket.on('userLeft', (msg: Message) => {
      setMessages((prevState) => [...prevState, { ...msg, isUserMsg: true }]);
    });
  }, []);

  const handleSubmit = (e: FormEvent) => {
    socket.emit('newMessage', { userId: user.id, message });
    setMessage('');
  };

  const allMessages = [...msgHistory, ...messages];

  return (
    <div className={styles.chat}>
      <div className={styles.chatContent}>
        <div className={styles.msgWrapper}>
          {allMessages.map((m: Message) => (
            <div key={m.id}>
              {m.isUserMsg ? (
                <div className={styles.center}>{m.message}</div>
              ) : (
                <>
                  <span className={styles.nickname}>{users[m.userId].name}</span>
                  <span className={styles.msg}>{m.message}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <BasicForm
        className={cx(styles.form, className)}
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
