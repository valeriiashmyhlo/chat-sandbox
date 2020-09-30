import React, { FC, FormEvent, useEffect, useState } from 'react';
import cx from 'classnames';
import styles from '../Chat/Chat.module.scss';
import BasicForm from '../BasicForm/BasicForm';

interface Message {
  messageId: string;
  message: string;
  userId: string;
  userName: string;
  isUserMsg?: boolean;
}

type Optional<I> = I | null;

interface User {
  userId: string;
  userName: string;
}

interface ChatProps {
  className?: string;
  socket: {
    emit(newUser: string, values: { message: string }): void;
    on(newUser: string, param2: (data: any) => void): void;
  };
}

const Chat: FC<ChatProps> = ({ socket, className }) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<Optional<User>>(null);

  useEffect(() => {
    socket.on('new user', (user: User) => setUser(user));

    socket.on('user joined', (userMsg: Message) => {
      setMessages((prevState) => [
        ...prevState,
        { ...userMsg, isUserMsg: true },
      ]);
    });

    socket.on('new message', (data: any) =>
      setMessages((prevState) => [...prevState, data])
    );
  }, []);

  const handleSubmit = (e: FormEvent) => {
    socket.emit('new message', { ...user, message });
    setMessage('');
  };

  return (
    <div className={styles.chat}>
      <div className={styles.chatContent}>
        <div className={styles.msgWrapper}>
          {messages.map((m: Message) => (
            <div key={m.messageId}>
              {m.isUserMsg ? (
                <div className={styles.center}>{m.message}</div>
              ) : (
                <>
                  <span className={styles.nickname}>{m.userName}</span>
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
