import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    FileTextOutlined,
    CloseCircleOutlined,
    StopOutlined,
} from "@ant-design/icons";

export default function StatCard({ stats }) {
    const statusConfig = [
        {
            key: "Pending",
            title: "Pending",
            icon: <ClockCircleOutlined />,
        },
        {
            key: "Approved",
            title: "Approved",
            icon: <CheckCircleOutlined />,
        },
        {
            key: "Ongoing",
            title: "Ongoing",
            icon: <SyncOutlined />,
        },
        {
            key: "Done",
            title: "Done",
            icon: <FileTextOutlined />,
        },
        {
            key: "Acknowledged",
            title: "Acknowledged",
            icon: <CheckCircleOutlined />,
        },
        {
            key: "Cancelled",
            title: "Cancelled",
            icon: <StopOutlined />,
        },
        {
            key: "Disapproved",
            title: "Disapproved",
            icon: <CloseCircleOutlined />,
        },
    ];

    // Map Ant Design color names to hex values
    const colorMap = {
        gold: "#faad14",
        lime: "#a0d911",
        green: "#52c41a",
        blue: "#1890ff",
        volcano: "#fa541c",
        red: "#ff4d4f",
        default: "#d9d9d9",
    };

    return (
        <Row gutter={[12, 12]}>
            {statusConfig.map((status) => {
                const statusData = stats?.[status.key];
                const count =
                    typeof statusData === "object"
                        ? statusData?.count
                        : statusData;

                // Get color from backend data, fallback to default
                const colorName =
                    typeof statusData === "object"
                        ? statusData?.color
                        : "default";
                const hexColor = colorMap[colorName] || colorMap.default;

                return (
                    <Col xs={12} sm={12} md={8} lg={6} xl={3} key={status.key}>
                        <Card size="small" variant="outlined">
                            <Statistic
                                title={status.title}
                                value={count || 0}
                                prefix={
                                    <span style={{ color: hexColor }}>
                                        {status.icon}
                                    </span>
                                }
                                styles={{
                                    content: {
                                        value: {
                                            color: hexColor,
                                            fontSize: "1.25rem",
                                            fontWeight: 600,
                                        },
                                    },
                                }}
                            />
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );
}
