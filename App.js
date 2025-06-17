import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Spin,
  Alert,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { API_URL, API_HEADERS } from "./config";

const { Title } = Typography;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, { headers: API_HEADERS });
      const result = response.data?.data;
      const formattedData = Array.isArray(result) ? result : [result];
      setData(formattedData);
    } catch (err) {
      console.error("Error fetching Frappe data:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(
        `http://3.111.75.24:8000/api/resource/nithish/${editingRecord.name}`,
        { data: values },
        { headers: API_HEADERS }
      );
      message.success("Record updated successfully");
      setIsModalVisible(false);
      fetchData();
    } catch (err) {
      console.error("Update error:", err);
      message.error("Failed to update record");
    }
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(
        `http://3.111.75.24:8000/api/resource/nithish/${record.name}`,
        { headers: API_HEADERS }
      );
      message.success("Record deleted successfully");
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Failed to delete record");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Firstname",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showEditModal(record)}>
            Update
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card bordered style={{ maxWidth: 800, margin: "0 auto" }}>
        <Title level={3}>Frappe Data Table</Title>
        {loading ? (
          <Spin tip="Loading..." style={{ display: "block", margin: "2rem auto" }} />
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : data.length > 0 ? (
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.name || Math.random()}
            pagination={false}
          />
        ) : (
          <Alert message="No data available" type="info" showIcon />
        )}
      </Card>

      <Modal
        title="Update Record"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
        okText="Update"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstname" label="Firstname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
