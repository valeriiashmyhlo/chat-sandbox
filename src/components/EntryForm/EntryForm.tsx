import React, { FC } from 'react';
import cx from 'classnames';
import { Button, Form, Input } from 'antd';
import styles from './EntryForm.module.scss';

interface EntryProps {
  className?: string;
  socket: { emit: (newUser: string, values: { userName: string }) => void };
}

const EntryForm: FC<EntryProps> = ({ socket, className }) => {
  const [form] = Form.useForm();
  const handleSubmit = (values: { userName: string }) => socket.emit('signIn', values);

  return (
    <Form
      form={form}
      className={cx(styles.form, className)}
      name="entryForm"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="userName"
        rules={[{ required: true, message: "Please input your nickname!" }]}
        className={styles.formItem}
      >
        <Input placeholder="Enter your nickname" />
      </Form.Item>
      <Button type="primary" htmlType="submit" className={styles.formBtn}>
        Submit
      </Button>
    </Form>
  );
};

export default EntryForm;
