import React, { FC } from 'react';
import BasicForm from '../BasicForm/BasicForm';

interface EntryProps {
  className?: string;
  socket: { emit: (newUser: string, values: { userName: string }) => void };
}

const EntryForm: FC<EntryProps> = ({ socket, className }) => {
  const handleSubmit = (values: { userName: string }) => socket.emit('signIn', values);

  return (
    <BasicForm
      className={className}
      formName="entryForm"
      handleSubmit={handleSubmit}
      inputName="userName"
      message="Please input your nickname!"
      placeholder="Enter your nickname"
    />
  );
};

export default EntryForm;
