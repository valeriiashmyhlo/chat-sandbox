import React, { FC } from 'react';
import io from 'socket.io-client';
import BasicForm from '../BasicForm/BasicForm';

const socket = io('http://localhost:8080', {
  transports: ['websocket'],
});

const EntryForm: FC<{ className?: string; onSubmit: () => void }> = (props) => {
  const handleSubmit = (values: { username: string }) => {
    socket.emit('new user', values);
    props.onSubmit();
  };

  return (
    <BasicForm
      className={props.className}
      formName="entryForm"
      handleSubmit={handleSubmit}
      inputName="username"
      message="Please input your nickname!"
      placeholder="Enter your nickname"
    />
  );
};

export default EntryForm;
