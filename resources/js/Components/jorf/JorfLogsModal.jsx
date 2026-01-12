import React, { useState } from "react";
import { Modal, Timeline, Button, Tag, Typography } from "antd";

const { Text } = Typography;
const PAGE_SIZE = 5;

const JorfLogsModal = ({ open, onClose, logs = [] }) => {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const handleLoadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

    // Format date as "Jan 01 2026"
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    const timelineItems = logs.slice(0, visibleCount).map((log) => ({
        key: log.ID,
        color: log.NEW_STATUS_COLOR || "blue",
        children: (
            <div className="space-y-1">
                {/* Header: Action type and actor */}
                <div className="flex flex-wrap gap-2 items-center">
                    <Tag color={log.NEW_STATUS_COLOR || "blue"}>
                        {log.ACTION_TYPE}
                    </Tag>
                    <Text type="secondary">by {log.ACTION_BY}</Text>
                    <Text type="secondary">{formatDate(log.ACTION_AT)}</Text>
                </div>

                {/* Status change */}
                <div className="flex gap-2">
                    <Text strong>Old Status:</Text>
                    <Tag color={log.OLD_STATUS_COLOR || "default"}>
                        {log.OLD_STATUS_LABEL || "-"}
                    </Tag>
                    <Text strong>→ New Status:</Text>
                    <Tag color={log.NEW_STATUS_COLOR || "blue"}>
                        {log.NEW_STATUS_LABEL || "-"}
                    </Tag>
                </div>

                {/* Old Values */}
                {log.OLD_VALUES && Object.keys(log.OLD_VALUES).length > 0 && (
                    <div>
                        <Text strong>Old Values:</Text>
                        <ul className="ml-4 list-disc">
                            {Object.entries(log.OLD_VALUES).map(
                                ([key, value]) => {
                                    // Skip 'status' object for display here
                                    if (
                                        key === "status" &&
                                        typeof value === "object"
                                    )
                                        return null;

                                    return (
                                        <li key={key}>
                                            <Text code>{key}:</Text>{" "}
                                            {value !== null &&
                                            value !== undefined
                                                ? String(value)
                                                : "null"}
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>
                )}

                {/* New Values */}
                {log.NEW_VALUES && Object.keys(log.NEW_VALUES).length > 0 && (
                    <div>
                        <Text strong>New Values:</Text>
                        <ul className="ml-4 list-disc">
                            {Object.entries(log.NEW_VALUES).map(
                                ([key, value]) => {
                                    if (
                                        key === "status" &&
                                        typeof value === "object"
                                    )
                                        return null;

                                    return (
                                        <li key={key}>
                                            <Text code>{key}:</Text>{" "}
                                            {value !== null &&
                                            value !== undefined
                                                ? String(value)
                                                : "null"}
                                        </li>
                                    );
                                }
                            )}
                        </ul>
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
            width={800}
        >
            <Timeline items={timelineItems} />

            {visibleCount < logs.length && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Button onClick={handleLoadMore}>Load more</Button>
                </div>
            )}
        </Modal>
    );
};

export default JorfLogsModal;
