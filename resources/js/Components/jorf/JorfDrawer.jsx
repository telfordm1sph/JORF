import React, { useEffect, useState } from "react";
import {
    Drawer,
    Descriptions,
    Divider,
    Image,
    Typography,
    Space,
    Button,
    InputNumber,
    Row,
    Col,
    Select,
    Rate,
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
const { Option } = Select;
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
    onLoadMoreLogs,
    logsHasMore,
    logsLoading,
    systemRoles = [],
}) => {
    if (!item) return null;
    console.log(item);

    const [remarks, setRemarks] = useState("");
    const [costAmount, setCostAmount] = useState(item.cost_amount || 0);
    const [logsOpen, setLogsOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [rating, setRating] = useState(item.rating || 0);

    useEffect(() => {
        if (item?.handled_by) {
            const selected = item.handled_by.split(",").map((id) => id.trim());
            setEmployee(selected);
        } else {
            setEmployee([]);
        }
    }, [item]);
    const fetchFacilitiesEmployee = async () => {
        if (employees.length > 0) return; // already fetched
        try {
            const res = await axios.get(route("jorf.facilities.employees"));
            console.log("Fetched employees:", res.data);

            // set only the array
            setEmployees(res.data.employees || []);
        } catch (err) {
            console.error("Error fetching employees:", err);
            setEmployees([]);
        }
    };

    const renderFieldValue = (field, value) => {
        if (field.render) return field.render(value, item);

        // Custom renderer for rating
        if (field.key === "rating") {
            return value !== null && value !== undefined ? (
                <Rate allowHalf value={value} disabled />
            ) : (
                <span className="text-gray-400 italic">Not yet rated</span>
            );
        }

        if (value === null || value === undefined)
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
        ONGOING: {
            label: "Ongoing",
            icon: <CheckCircleOutlined />,
            color: "orange",
        },
        DONE: {
            label: "Done",
            icon: <CheckCircleOutlined />,
            color: "green",
        },
        ACKNOWLEDGE: {
            label: "Acknowledge",
            icon: <CheckCircleOutlined />,
            color: "green",
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
                <div className="flex justify-between items-center gap-2 py-1">
                    {/* Badges scrollable if many */}
                    <div className="flex gap-2 flex-nowrap overflow-x-auto">
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

                    {/* Button always on the right */}
                    {jorfLogs && jorfLogs.length > 0 && (
                        <Button
                            size="small"
                            shape="round"
                            onClick={() => setLogsOpen(true)}
                        >
                            <HistoryOutlined /> Logs
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
                                                costAmount,
                                                rating,
                                                handledBy: employee,
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
                {availableActions.includes("ACKNOWLEDGE") && (
                    <div className="mt-4">
                        <h3> Rate your experience</h3>
                        <Rate
                            allowHalf
                            value={rating}
                            onChange={(value) => setRating(value)}
                        />
                    </div>
                )}

                {systemRoles.includes("Facilities_Coordinator") &&
                    ["2", "3"].includes(String(item.status)) && (
                        <div>
                            <Row gutter={16}>
                                {/* Cost Amount */}
                                <Col span={12}>
                                    <h3>Cost Amount</h3>
                                    <InputNumber
                                        className="w-full rounded-lg text-sm mt-2"
                                        placeholder="Enter cost amount..."
                                        value={costAmount}
                                        controls={false}
                                        min={0}
                                        step={1}
                                        stringMode={false}
                                        formatter={(value) => {
                                            if (!value && value !== 0)
                                                return "";
                                            const v = value
                                                .toString()
                                                .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                );
                                            return `₱ ${v}`;
                                        }}
                                        parser={(value) => {
                                            if (!value) return 0;
                                            return value.replace(/[₱,]/g, "");
                                        }}
                                        onChange={(value) =>
                                            setCostAmount(value || 0)
                                        }
                                    />
                                </Col>

                                {/* Facilities Employee */}
                                <Col span={12}>
                                    <h3>Handler</h3>
                                    <Select
                                        className="w-full mt-2"
                                        placeholder="Select Employee"
                                        value={employee}
                                        onChange={(value) => setEmployee(value)}
                                        onFocus={fetchFacilitiesEmployee}
                                        showSearch
                                        mode="multiple"
                                        optionFilterProp="search"
                                        options={employees.map((emp) => ({
                                            label: `${emp.emp_id} - ${emp.empname}`,
                                            value: emp.emp_id,
                                            search: `${emp.emp_id} ${emp.empname}`.toLowerCase(),
                                        }))}
                                    />
                                </Col>
                            </Row>
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
                    onLoadMore={onLoadMoreLogs}
                    hasMore={logsHasMore}
                    loading={logsLoading}
                />
            </div>
        </Drawer>
    );
};

export default JorfDrawer;
