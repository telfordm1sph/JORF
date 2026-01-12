import React, { useState } from "react";
import {
    Drawer,
    Descriptions,
    Divider,
    Image,
    Typography,
    Space,
    Button,
} from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    HistoryOutlined,
    StopOutlined,
} from "@ant-design/icons";
import JorfLogsModal from "./JorfLogsModal";

const { Text, Link } = Typography;

const JorfDrawer = ({
    open,
    onClose,
    item,
    fieldGroups,
    attachments = [],
    title,
    headerBadges = [],
    availableAction = [],
    action,
    jorfLogs = [],
}) => {
    if (!item) return null;
    console.log("available Action", availableAction);
    console.log("countLogs", jorfLogs);

    const [remarks, setRemarks] = useState("");
    const [logsOpen, setLogsOpen] = useState(false);
    const drawerTitle =
        typeof title === "function" ? title(item) : title || "Item Details";

    const renderFieldValue = (field, value) => {
        if (field.render) return field.render(value, item);
        if (!value)
            return <span className="text-gray-400 italic">Not specified</span>;
        return <span>{value}</span>;
    };

    const getValue = (item, dataIndex) => {
        if (!item) return undefined;
        if (Array.isArray(dataIndex))
            return dataIndex.reduce((acc, key) => acc?.[key], item);
        return item[dataIndex];
    };
    const availableActions = Array.isArray(availableAction)
        ? availableAction
        : Array.isArray(availableAction?.availableActions)
        ? availableAction.availableActions
        : [];
    const availableActionConfig = {
        APPROVE: {
            label: "Approve",
            icon: <CheckCircleOutlined />,
            color: "green",
            variant: "solid",
        },
        DISAPPROVE: {
            label: "Disapprove",
            icon: <CloseCircleOutlined />,
            color: "red",
            variant: "solid",
        },
        CANCEL: {
            label: "Cancel",
            icon: <StopOutlined />,
            color: "red",
            variant: "solid",
        },
        VIEW: {
            label: "View",
            icon: <EyeOutlined />,
            color: "blue",
            variant: "link",
        },
    };

    return (
        <Drawer
            title={
                <div className="flex gap-2 flex-nowrap overflow-x-auto py-1">
                    {headerBadges.map((field) => (
                        <div
                            key={field.key}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-base-200 text-xs font-medium whitespace-nowrap"
                        >
                            <span className="mr-1 opacity-60">
                                {field.label}:
                            </span>
                            {field.render
                                ? field.render(item[field.dataIndex])
                                : item[field.dataIndex] || "N/A"}
                        </div>
                    ))}
                    {jorfLogs && jorfLogs.length > 0 && (
                        <Button
                            size="small"
                            onClick={() => setLogsOpen(true)}
                            style={{ marginLeft: 8 }}
                        >
                            <HistoryOutlined /> View Logs
                        </Button>
                    )}
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            size={1000}
            footer={
                availableActions.length > 0 && (
                    <Space style={{ float: "right" }}>
                        {availableActions
                            .filter((a) => a.toUpperCase() !== "VIEW") // exclude ONLY view
                            .map((a) => {
                                const key = a.toUpperCase();
                                const cfg = availableActionConfig[key];

                                return (
                                    <Button
                                        key={key}
                                        icon={cfg?.icon}
                                        color={cfg?.color}
                                        variant={cfg?.variant || "solid"}
                                        onClick={() => {
                                            action?.({
                                                action: key,
                                                item,
                                                remarks,
                                            });
                                            onClose?.();
                                        }}
                                    >
                                        {cfg?.label ||
                                            a.replace(/_/g, " ").toUpperCase()}
                                    </Button>
                                );
                            })}
                    </Space>
                )
            }
        >
            <div className="space-y-6">
                {fieldGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        {group.title && (
                            <>
                                <h3 className="text-lg font-semibold mb-3">
                                    {group.title}
                                </h3>
                                <Divider className="mt-2 mb-4" />
                            </>
                        )}
                        <Descriptions
                            layout="vertical"
                            column={group.column || 1}
                            size="middle"
                        >
                            {group.fields.map((field) => (
                                <Descriptions.Item
                                    key={field.key}
                                    label={field.label}
                                >
                                    {renderFieldValue(
                                        field,
                                        getValue(item, field.dataIndex)
                                    )}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    </div>
                ))}

                {attachments.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">
                            Attachments
                        </h3>
                        <Divider className="mt-2 mb-4" />
                        <div className="flex flex-col gap-4">
                            {attachments.map((file) => {
                                // Check if file is an image
                                const isImage =
                                    file.file_type.startsWith("image/");
                                return (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-3"
                                    >
                                        {isImage && (
                                            <Image
                                                src={file.file_path}
                                                width={50}
                                                height={50}
                                                style={{ objectFit: "cover" }}
                                                preview={{
                                                    src: file.file_path,
                                                }}
                                            />
                                        )}
                                        <div>
                                            <Link
                                                href={file.file_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {file.file_name}
                                            </Link>
                                            <div className="text-gray-500 text-sm">
                                                {(
                                                    file.file_size / 1024
                                                ).toFixed(1)}{" "}
                                                KB
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {availableActions &&
                    availableActions.length > 0 &&
                    !(
                        availableActions.length === 1 &&
                        availableActions[0].toUpperCase() === "VIEW"
                    ) && (
                        <div>
                            <h3>Remarks</h3>
                            <textarea
                                className="textarea textarea-bordered w-full rounded-lg text-sm resize-y mt-2"
                                rows={4}
                                placeholder="Enter remarks..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    )}
                <JorfLogsModal
                    open={logsOpen}
                    onClose={() => setLogsOpen(false)}
                    logs={jorfLogs}
                />
            </div>
        </Drawer>
    );
};

export default JorfDrawer;
