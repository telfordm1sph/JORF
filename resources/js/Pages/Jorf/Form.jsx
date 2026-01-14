import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    Card,
    Select,
    Form,
    Button,
    Upload,
    message,
    Input,
    Row,
    Col,
} from "antd";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import EmployeeInfo from "@/Components/form/EmployeeInfo";


const { TextArea } = Input;

const FormJORF = () => {
    const { requestType, emp_data } = usePage().props;
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const onFinish = async (values) => {
        if (submitting) return;

        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append("request_type", values.request_type);
            formData.append("request_details", values.request_details);

            (values.attachments || []).forEach((file) => {
                formData.append("attachments[]", file.originFileObj);
            });

            await axios.post(route("jorf.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("JORF submitted successfully!");

            window.location.reload();
        } catch (error) {
            console.error(error);
            message.error("Failed to submit JORF.");
            setSubmitting(false); // re-enable if failed
        }
    };

    const uploadProps = {
        multiple: true,
        beforeUpload: () => false, // prevent auto upload
        onChange(info) {
            if (info.file.status === "error") {
                message.error(`${info.file.name} upload failed.`);
            }
        },
    };

    return (
        <AuthenticatedLayout>
            <Head title="Generate JORF" />
            <Card>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <EmployeeInfo emp_data={emp_data} />

                    {/* Request type + Upload button in one row */}
                    <Row gutter={16}>
                        <Col span={16}>
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
                                    placeholder="Please select request type"
                                    allowClear
                                    options={requestType.map((req) => ({
                                        value: req.request_name,
                                        label: req.request_name,
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Attachments"
                                name="attachments"
                                valuePropName="fileList"
                                getValueFromEvent={(e) =>
                                    Array.isArray(e) ? e : e?.fileList
                                }
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please upload at least one file",
                                    },
                                ]}
                            >
                                <Upload {...uploadProps}>
                                    <Button
                                        icon={<UploadOutlined />}
                                        style={{ width: "100%" }}
                                    >
                                        Upload Files
                                    </Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* TextArea at the bottom */}
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
                            placeholder="Describe your request here..."
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                             style={{ backgroundColor: "#7C2D12" }}
                            htmlType="submit"
                            block
                            loading={submitting}
                            disabled={submitting}
                        >
                            <SendOutlined /> Generate
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </AuthenticatedLayout>
    );
};

export default FormJORF;
