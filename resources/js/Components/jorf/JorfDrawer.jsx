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
    message,
} from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    HistoryOutlined,
    StopOutlined,
} from "@ant-design/icons";
import axios from "axios";
import JorfLogsModal from "./JorfLogsModal";

const { Link } = Typography;

const JorfDrawer = ({
    open,
    onClose,
    item,
    fieldGroups,
    attachments = [],
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

    const [remarks, setRemarks] = useState("");
    const [costAmount, setCostAmount] = useState(item.cost_amount || 0);
    const [logsOpen, setLogsOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [rating, setRating] = useState(item.rating || 0);

    // controls if ACKNOWLEDGE step is active
    const [acknowledgeMode, setAcknowledgeMode] = useState(false);

    useEffect(() => {
        if (item?.handled_by) {
            setEmployee(item.handled_by.split(",").map((id) => id.trim()));
        } else {
            setEmployee([]);
        }
        setAcknowledgeMode(false);
        setRating(item.rating || 0);
    }, [item]);

    const fetchFacilitiesEmployee = async () => {
        if (employees.length > 0) return;
        try {
            const res = await axios.get(route("jorf.facilities.employees"));
            setEmployees(res.data.employees || []);
        } catch {
            setEmployees([]);
        }
    };

    const renderFieldValue = (field, value) => {
        if (field.render) return field.render(value, item);

        if (field.key === "rating") {
            return value ? (
                <Rate allowHalf value={value} disabled />
            ) : (
                "Not yet rated"
            );
        }

        return (
            value ?? <span className="text-gray-400 italic">Not specified</span>
        );
    };

    const getValue = (item, dataIndex) => {
        if (Array.isArray(dataIndex))
            return dataIndex.reduce((acc, key) => acc?.[key], item);
        return item[dataIndex];
    };

    const availableActionsList = Array.isArray(availableAction)
        ? availableAction
        : availableAction?.availableActions || [];
    console.log(availableActionsList);

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
        RETURN: {
            label: "Return",
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
            open={open}
            onClose={onClose}
            placement="right"
            size={1000}
            title={
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 overflow-x-auto">
                        {headerBadges.map((b) => (
                            <span
                                key={b.key}
                                className="px-3 py-1 bg-base-200 rounded-full text-xs"
                            >
                                {b.label}:{" "}
                                {b.render
                                    ? b.render(item[b.dataIndex])
                                    : item[b.dataIndex] || "N/A"}
                            </span>
                        ))}
                    </div>
                    {jorfLogs.length > 0 && (
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
            footer={
                availableActionsList.length > 0 && (
                    <Space style={{ float: "right" }}>
                        {availableActionsList
                            .filter((a) => a.toUpperCase() !== "VIEW")
                            .map((a) => {
                                const key = a.toUpperCase();
                                const cfg = availableActionConfig[key];
                                return (
                                    <Button
                                        key={key}
                                        icon={cfg?.icon}
                                        color={cfg?.color}
                                        variant={cfg?.variant || "solid"}
                                        disabled={
                                            key === "RETURN" && acknowledgeMode
                                        }
                                        onClick={() => {
                                            // Step 1: first click on ACKNOWLEDGE → show rating
                                            if (
                                                key === "ACKNOWLEDGE" &&
                                                !acknowledgeMode
                                            ) {
                                                setAcknowledgeMode(true);
                                                return;
                                            }

                                            // Step 2: require rating before submit
                                            if (
                                                key === "ACKNOWLEDGE" &&
                                                acknowledgeMode &&
                                                rating === 0
                                            ) {
                                                message.warning(
                                                    "Please provide a rating before acknowledging.",
                                                );
                                                return;
                                            }

                                            // Submit action
                                            action?.({
                                                action: key,
                                                item,
                                                remarks,
                                                costAmount,
                                                rating,
                                                handledBy: employee,
                                            });

                                            setAcknowledgeMode(false);
                                            onClose?.();
                                        }}
                                    >
                                        {cfg.label}
                                    </Button>
                                );
                            })}
                    </Space>
                )
            }
        >
            <div className="space-y-6">
                {/* Render all field groups */}
                {fieldGroups.map((group, i) => (
                    <div key={i}>
                        {group.title && (
                            <h3 className="text-lg font-semibold mb-2">
                                {group.title}
                            </h3>
                        )}
                        <Divider />
                        <Descriptions
                            layout="vertical"
                            column={group.column || 1}
                        >
                            {group.fields.map((field) => (
                                <Descriptions.Item
                                    key={field.key}
                                    label={field.label}
                                >
                                    {renderFieldValue(
                                        field,
                                        getValue(item, field.dataIndex),
                                    )}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    </div>
                ))}

                {/* Attachments */}
                {attachments.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">
                            Attachments
                        </h3>
                        <Divider />
                        <div className="flex flex-col gap-3">
                            {attachments.map((file) => {
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

                {/* Rating: only shows if ACKNOWLEDGE clicked */}
                {acknowledgeMode && (
                    <div className="mt-4">
                        <h3>Rate your experience</h3>
                        <Rate allowHalf value={rating} onChange={setRating} />
                    </div>
                )}

                {/* Facilities coordinator fields */}
                {systemRoles.includes("Facilities_Coordinator") &&
                    ["2", "3"].includes(String(item.status)) && (
                        <div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <h3>Cost Amount</h3>
                                    <InputNumber
                                        className="w-full rounded-lg mt-2"
                                        placeholder="Enter cost amount..."
                                        value={costAmount}
                                        controls={false}
                                        min={0}
                                        step={1}
                                        formatter={(v) =>
                                            v
                                                ? `₱ ${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                                : ""
                                        }
                                        parser={(v) =>
                                            v ? v.replace(/[₱,]/g, "") : 0
                                        }
                                        onChange={(v) => setCostAmount(v || 0)}
                                    />
                                </Col>
                                <Col span={12}>
                                    <h3>Handler</h3>
                                    <Select
                                        className="w-full mt-2"
                                        placeholder="Select Employee"
                                        value={employee}
                                        onChange={setEmployee}
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

                {/* Remarks */}
                {availableActionsList.length > 0 &&
                    !(
                        availableActionsList.length === 1 &&
                        availableActionsList[0].toUpperCase() === "VIEW"
                    ) && (
                        <div>
                            <h3>Remarks</h3>
                            <textarea
                                className="textarea textarea-bordered w-full mt-2"
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
