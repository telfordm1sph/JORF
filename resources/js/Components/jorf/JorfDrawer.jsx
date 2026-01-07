import React from "react";
import { Drawer, Descriptions, Divider, Image, Typography } from "antd";

const { Text, Link } = Typography;

const JorfDrawer = ({
    open,
    onClose,
    item,
    fieldGroups,
    attachments = [],
    title,
    headerBadges = [],
}) => {
    if (!item) return null;

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
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            size={1000}
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
            </div>
        </Drawer>
    );
};

export default JorfDrawer;
