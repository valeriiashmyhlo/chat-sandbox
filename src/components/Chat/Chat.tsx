import React, { FC, FormEvent, useEffect, useState, useReducer } from 'react';
import cx from 'classnames';
import { Button, Form, Input } from 'antd';
import styles from '../Chat/Chat.module.scss';
import Sidebar from '../Sidebar/Sidebar';
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
  const [form] = Form.useForm();

  useEffect(() => {
    socket.on('newMessage', (msg: Message) => setMessages((prevState) => [...prevState, msg]));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    socket.emit('newMessage', { userId: user.id, message });
    setMessage('');
    form.resetFields();
  };

  const allMessages = [...msgHistory, ...messages];

  return (
    <div className={styles.chatWrapper}>
      <Sidebar users={Object.values(users)} />
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
        <Form form={form} className={cx(styles.form, className)} name="chatForm" onFinish={handleSubmit}>
          <Form.Item name="message" rules={[{ required: true, message }]} className={styles.formItem}>
            <Input
              placeholder="Please enter your message!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className={styles.formBtn}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
