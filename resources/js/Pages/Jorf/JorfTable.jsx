import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, Table, Tag, message } from "antd";

import TableToolbar from "@/Components/TableToolbar";
import { usePage } from "@inertiajs/react";
import useJorfTable from "@/Hooks/useJorfTable";
import JorfDrawer from "@/Components/jorf/JorfDrawer";
import { useDrawer } from "@/Hooks/useDrawer";
import axios from "axios";
import dayjs from "dayjs";
import StatCard from "@/Components/StatCard";

const JorfTable = () => {
    const {
        jorfs,
        pagination,
        statusCounts,
        filters: initialFilters,
        emp_data,
    } = usePage().props;
    console.log(usePage().props);

    const {
        loading,
        searchValue,
        statusFilter,
        handleStatusChange,
        handleTableChange,
        handleSearch,
    } = useJorfTable({ initialFilters, pagination });

    const { drawerOpen, selectedItem, openDrawer, closeDrawer } = useDrawer();
    const [attachments, setAttachments] = useState([]);
    const [availableAction, setAvailableAction] = useState(null);
    const [jorfLogs, setJorfLogs] = useState([]);
    const [logsCurrentPage, setLogsCurrentPage] = useState(1);
    const [logsHasMore, setLogsHasMore] = useState(false);
    const [logsLoading, setLogsLoading] = useState(false);
    const renderValue = (value) =>
        value === null || value === "" ? "-" : value;

    const fetchAttachments = async (jorfId) => {
        try {
            const res = await axios.get(route("jorf.attachments", jorfId));
            const availableActRes = await axios.get(
                route("jorf.getActions", jorfId)
            );
            setAvailableAction(availableActRes.data.actions || null);
            setAttachments(res.data.attachments || []);
        } catch (err) {
            console.error("Error fetching attachments", err);
            setAttachments([]);
        }
    };

    const fetchJorfLogs = async (jorfId, page = 1) => {
        if (!jorfId) {
            console.warn("JORF ID is required to fetch logs");
            setJorfLogs([]);
            return;
        }

        setLogsLoading(true);
        try {
            const res = await axios.get(route("jorf.logs", jorfId), {
                params: { page },
            });

            const newLogs = Array.isArray(res.data?.data) ? res.data.data : [];

            if (page === 1) {
                setJorfLogs(newLogs);
            } else {
                setJorfLogs((prev) => [...prev, ...newLogs]);
            }

            setLogsCurrentPage(page);
            setLogsHasMore(res.data?.pagination?.has_more || false);
        } catch (err) {
            console.error("Error fetching JORF logs:", err);
            if (page === 1) {
                setJorfLogs([]);
            }
        } finally {
            setLogsLoading(false);
        }
    };

    const handleLoadMoreLogs = () => {
        if (selectedItem?.jorf_id) {
            fetchJorfLogs(selectedItem.jorf_id, logsCurrentPage + 1);
        }
    };
    const handleJorfAction = async ({
        action,
        item,
        remarks,
        costAmount,
        rating,
        handledBy,
    }) => {
        if (!remarks?.trim()) {
            message.error("Please enter remarks.");
            return;
        }
        if (!costAmount && (action === "ONGOING" || action === "DONE")) {
            message.error("Please enter cost amount.");
            return;
        }
        if (!handledBy && (action === "ONGOING" || action === "DONE")) {
            message.error("Please enter Facilities Employee(s).");
            return;
        }
        if (!rating && action === "ACKNOWLEDGE") {
            message.error("Please enter rating.");
            return;
        }

        const payload = {
            jorf_id: item.jorf_id,
            action,
            remarks,
            cost_amount: costAmount,
            rating,
            handled_by: handledBy,
        };

        try {
            const res = await axios.post(route("jorf.actions"), payload);

            if (res.data.success) {
                message.success(res.data.message);
                window.location.reload();
            } else {
                message.error(res.data.message);
            }
        } catch (err) {
            message.error("Failed to update JORF.");
        }
    };

    const columns = [
        { title: "JORF ID", dataIndex: "jorf_id", key: "jorf_id" },
        {
            title: "Requestor",
            dataIndex: "employid",
            key: "employid",
            render: (text, record) => (
                <div>
                    <div>{text}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>
                        {record.empname}
                    </div>
                </div>
            ),
        },
        { title: "Department", dataIndex: "department", key: "department" },
        { title: "Product Line", dataIndex: "prodline", key: "prodline" },
        { title: "Station", dataIndex: "station", key: "station" },
        {
            title: "Request Type",
            dataIndex: "request_type",
            key: "request_type",
        },
        {
            title: "Details",
            dataIndex: "details",
            key: "details",
            render: renderValue,
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            key: "remarks",
            render: renderValue,
        },
        {
            title: "Cost Amount",
            dataIndex: "cost_amount",
            key: "cost_amount",
            render: (value) =>
                value
                    ? `₱${parseFloat(value)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    : "-",
        },
        {
            title: "Handled By",
            dataIndex: "handled_by",
            key: "handled_by",
            render: renderValue,
        },
        {
            title: "Handled At",
            dataIndex: "handled_at",
            key: "handled_at",
            render: (value) =>
                value ? dayjs(value).format("MMM D, YYYY h:mm A") : "-",
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Tag color={record.status_color}>{record.status_label}</Tag>
            ),
        },
    ];

    const headerBadges = [
        {
            key: "status_label",
            label: "Status",
            dataIndex: "status_label",
            render: (value) => {
                const badgeColor = statusCounts[value]?.color || "default";
                return <Tag color={badgeColor}>{value}</Tag>;
            },
        },
    ];

    const jorfFieldGroups = [
        {
            title: "General Information",
            column: 2,
            fields: [
                { key: "jorf_id", label: "JORF ID", dataIndex: "jorf_id" },
                { key: "requestor", label: "Requestor", dataIndex: "empname" },
                {
                    key: "department",
                    label: "Department",
                    dataIndex: "department",
                },
                {
                    key: "product_line",
                    label: "Product Line",
                    dataIndex: "prodline",
                },
                { key: "station", label: "Station", dataIndex: "station" },
                {
                    key: "request_type",
                    label: "Request Type",
                    dataIndex: "request_type",
                },
            ],
        },
        {
            title: "Details & Remarks",
            column: 2,
            fields: [
                { key: "details", label: "Details", dataIndex: "details" },
                { key: "remarks", label: "Remarks", dataIndex: "remarks" },
                {
                    key: "cost_amount",
                    label: "Cost Amount",
                    dataIndex: "cost_amount",
                    render: (value) => {
                        if (value == null) return "Not Specified";
                        return `₱ ${value
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                    },
                },
                { key: "rating", label: "Rating", dataIndex: "rating" },
            ],
        },
        {
            title: "Handling",
            column: 2,
            fields: [
                {
                    key: "handled_by_name",
                    label: "Handled By",
                    dataIndex: "handled_by_name",
                },
                {
                    key: "handled_at",
                    label: "Handled At",
                    dataIndex: "handled_at",
                    render: (value) =>
                        value ? dayjs(value).format("MMM D, YYYY h:mm A") : "-",
                },
            ],
        },
    ];

    const paginationConfig = useMemo(
        () => ({
            current: pagination.current || pagination.currentPage,
            pageSize: pagination.pageSize || pagination.perPage,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
        }),
        [pagination]
    );

    return (
        <AuthenticatedLayout>
            {/* Mini status overview cards */}
            <StatCard stats={statusCounts} />

            {/* Search and filter toolbar */}

            {/* Main data table */}
            <Card style={{ marginTop: 16 }}>
                <div>
                    <TableToolbar
                        searchValue={searchValue}
                        onSearch={handleSearch}
                        statusFilter={statusFilter}
                        onStatusChange={handleStatusChange}
                        statusCounts={statusCounts}
                    />
                </div>
                <Table
                    dataSource={jorfs}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1500 }}
                    pagination={paginationConfig}
                    onChange={handleTableChange}
                    onRow={(record) => ({
                        onClick: async () => {
                            openDrawer(record);
                            await fetchAttachments(record.jorf_id);
                            await fetchJorfLogs(record.jorf_id);
                        },
                        style: { cursor: "pointer" },
                    })}
                />
            </Card>

            {/* Drawer for JORF details */}
            <JorfDrawer
                open={drawerOpen}
                onClose={closeDrawer}
                item={selectedItem}
                attachments={attachments}
                fieldGroups={jorfFieldGroups}
                title={(item) => `JORF Details: ${item?.jorf_id}`}
                headerBadges={headerBadges}
                availableAction={availableAction}
                action={handleJorfAction}
                jorfLogs={jorfLogs}
                onLoadMoreLogs={handleLoadMoreLogs}
                logsHasMore={logsHasMore}
                logsLoading={logsLoading}
                systemRoles={emp_data?.system_roles || []}
            />
        </AuthenticatedLayout>
    );
};

export default JorfTable;
