import React from 'react';
import { Menu, Badge } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { User } from 'types';
import styles from './Sidebar.module.scss';

const { SubMenu, Item } = Menu;

interface SidebarProps {
  users: User[];
}
const Sidebar: React.FC<SidebarProps> = ({ users }) => {
  return (
      <Menu
        theme="dark"
        style={{ width: 150 }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[]}
        mode="inline"
      >
        <SubMenu key="sub1" icon={<MailOutlined />} title="Room One">
          {users.map((user) => (
            <Item key={user.id}>
              <span className={styles.name}>{user.name}</span>
              <Badge status={user.isOnline ? "success" : "error"} />
            </Item>
          ))}
        </SubMenu>
      </Menu>
  );
};

export default Sidebar;
