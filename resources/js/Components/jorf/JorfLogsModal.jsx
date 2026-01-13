import React, { useState } from "react";
import {
    Modal,
    Timeline,
    Button,
    Tag,
    Typography,
    Space,
    Divider,
    Calendar,
} from "antd";
import dayjs from "dayjs";

import {
    CalendarOutlined,
    DoubleRightOutlined,
    UserOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const JorfLogsModal = ({
    open,
    onClose,
    logs = [],
    onLoadMore,
    hasMore,
    loading,
}) => {
    console.log(logs);

    // Format date as "Jan 01, 2026 12:00 PM"
    const formatDate = (dateString) => {
        if (!dateString) return "null"; // handle null or undefined
        return dayjs(dateString).format("MMM DD, YYYY hh:mm A");
    };

    const formatValue = (value) => {
        if (value === null || value === undefined) return "null";

        // Only attempt to format strings that look like dates
        if (
            typeof value === "string" &&
            dayjs(value, { strict: true }).isValid()
        ) {
            return dayjs(value).format("MMM DD, YYYY hh:mm A");
        }

        return String(value); // leave numbers, IDs, etc. as-is
    };

    const timelineItems = logs.map((log) => ({
        key: log.ID,
        color: log.NEW_STATUS_COLOR || "blue",
        content: (
            <div className="flex flex-col gap-2 w-full">
                {/* Header: Action type and actor */}
                <div className="flex flex-wrap gap-2 items-center">
                    <Tag color={log.NEW_STATUS_COLOR || "blue"}>
                        {log.ACTION_TYPE}
                    </Tag>
                    <Text type="secondary" className="flex items-center gap-1">
                        <UserOutlined /> by {log.ACTION_BY}
                    </Text>
                    ||
                    <Text type="secondary" className="flex items-center gap-1">
                        <CalendarOutlined /> {formatDate(log.ACTION_AT)}
                    </Text>
                </div>

                {/* Status change */}
                <div className="flex items-center gap-3">
                    <Space size="small">
                        <Text type="secondary">Status:</Text>
                        <Tag color={log.OLD_STATUS_COLOR || "default"}>
                            {log.OLD_STATUS_LABEL || "-"}
                        </Tag>
                    </Space>
                    <DoubleRightOutlined className="text-gray-400" />
                    <Tag color={log.NEW_STATUS_COLOR || "blue"}>
                        {log.NEW_STATUS_LABEL || "-"}
                    </Tag>
                </div>
                {/* New Values */}
                {log.NEW_VALUES && Object.keys(log.NEW_VALUES).length > 0 && (
                    <div className="mb-2">
                        <Text strong>New Values:</Text>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(log.NEW_VALUES).map(
                                ([key, value]) => {
                                    if (
                                        key === "status" &&
                                        typeof value === "object"
                                    )
                                        return null;
                                    return (
                                        <div
                                            key={key}
                                            className="flex gap-1 items-center"
                                        >
                                            <Text code>{key}:</Text>
                                            <Text ellipsis>
                                                {formatValue(value)}
                                            </Text>
                                        </div>
                                    );
                                }
                            )}
                        </div>{" "}
                    </div>
                )}

                {/* Old Values */}
                {log.OLD_VALUES && Object.keys(log.OLD_VALUES).length > 0 && (
                    <div className="mb-2">
                        <Text strong>Old Values:</Text>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {Object.entries(log.OLD_VALUES).map(
                                ([key, value]) => {
                                    if (
                                        key === "status" &&
                                        typeof value === "object"
                                    )
                                        return null;

                                    return (
                                        <div
                                            key={key}
                                            className="flex gap-1 items-center"
                                        >
                                            <Text code>{key}:</Text>
                                            <Text ellipsis>
                                                {formatValue(value)}
                                            </Text>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}

                {/* Remarks */}
                {log.REMARKS && (
                    <div>
                        <Text strong>Remarks:</Text> {log.REMARKS}
                    </div>
                )}
            </div>
        ),
    }));

    return (
        <Modal
            title="JORF History Logs"
            open={open}
            onCancel={onClose}
            footer={null}
            width="80%"
            style={{ top: 20 }}
            styles={{
                body: {
                    maxHeight: "80vh",
                    overflowY: "auto",
                    overflowX: "auto",
                },
            }}
        >
            <Timeline items={timelineItems} />

            {hasMore && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Button onClick={onLoadMore} loading={loading}>
                        Load more
                    </Button>
                </div>
            )}
        </Modal>
    );
};

export default JorfLogsModal;
