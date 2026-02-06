import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    Card,
    Select,
    Form,
    Button,
    message,
    Input,
    Row,
    Col,
    Divider,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import EmployeeInfo from "@/Components/form/EmployeeInfo";
import AttachmentUpload from "@/Components/form/AttachmentUpload";
import axios from "axios";

const { TextArea } = Input;

const FormJORF = () => {
    const { requestType, emp_data } = usePage().props;
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [fileList, setFileList] = useState([]);

    const onFinish = async (values) => {
        if (submitting) return;
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("request_type", values.request_type);
            formData.append("request_details", values.request_details);

            fileList.forEach((file) => {
                formData.append("attachments[]", file);
            });

            await axios.post(route("jorf.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            message.success("JORF submitted successfully!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            message.error("Failed to submit JORF.");
            setSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Generate JORF" />

            <Row justify="center">
                <Col xs={24} md={20} lg={16}>
                    <Card title="Job Order Request Form" bordered>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            {/* Employee Information */}
                            <EmployeeInfo emp_data={emp_data} />

                            <Divider />
                            <Form.Item
                                label="Request Type"
                                name="request_type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select request type",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select request type"
                                    allowClear
                                    options={requestType.map((req) => ({
                                        value: req.request_name,
                                        label: req.request_name,
                                    }))}
                                />
                            </Form.Item>

                            {/* Request Details */}
                            <Form.Item
                                label="Request Details"
                                name="request_details"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter request details",
                                    },
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Describe your request clearly..."
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                            {/* Attachments */}
                            <Form.Item
                                label="Attachments"
                                required
                                extra="Drag & drop files. Images will show preview. Max 10MB per file."
                            >
                                <AttachmentUpload onFilesChange={setFileList} />
                            </Form.Item>
                            <Divider />

                            {/* Submit */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    icon={<SendOutlined />}
                                    loading={submitting}
                                    disabled={submitting}
                                    style={{ backgroundColor: "#7C2D12" }}
                                >
                                    Generate JORF
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </AuthenticatedLayout>
    );
};

export default FormJORF;
