import React, { FC, ChangeEvent } from 'react';
import { Form, Input, Button } from 'antd';
import styles from './BasicForm.module.scss';
import cx from 'classnames';

interface FormProps {
  formName: string;
  className?: string;
  handleSubmit: (values: any) => void;
  inputName: string;
  message: string;
  placeholder: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const BasicForm: FC<FormProps> = ({
  formName,
  className,
  handleSubmit,
  inputName,
  message,
  placeholder,
  value,
  onChange,
}) => {
  const [form] = Form.useForm();

  const submit = (values: any) => {
    handleSubmit(values);
    form.resetFields();
  }

  return (
    <Form
      form={form}
      className={cx(styles.form, className)}
      name={formName}
      onFinish={submit}
    >
      <Form.Item
        name={inputName}
        rules={[{ required: true, message }]}
        className={styles.formItem}
      >
        <Input placeholder={placeholder} value={value} onChange={onChange} />
      </Form.Item>
      <Button type="primary" htmlType="submit" className={styles.formBtn}>
        Submit
      </Button>
    </Form>
  );
}

export default BasicForm;
