import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, Table, Input, Tag } from "antd";
import StatCard from "@/Components/StatCard";
import {
    SearchOutlined,
    AppstoreOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    StopOutlined,
    LikeOutlined,
    DislikeOutlined,
} from "@ant-design/icons";
import { usePage } from "@inertiajs/react";
import useJorfTable from "@/Hooks/useJorfTable";
import JorfDrawer from "@/Components/jorf/JorfDrawer";
import { useDrawer } from "@/Hooks/useDrawer";
import axios from "axios";

const iconMap = {
    All: AppstoreOutlined,
    Approved: LikeOutlined,
    Disapproved: DislikeOutlined,
    Cancelled: StopOutlined,
    Done: CheckCircleOutlined,
    Ongoing: SyncOutlined,
    Pending: ClockCircleOutlined,
};

const JorfTable = () => {
    const {
        jorfs,
        pagination,
        statusCounts,
        filters: initialFilters,
    } = usePage().props;
    console.log(usePage().props);

    const {
        loading,
        searchValue,
        activeFilter,
        handleStatusFilter,
        handleTableChange,
        handleSearch,
    } = useJorfTable({ initialFilters, pagination });
    const { drawerOpen, selectedItem, openDrawer, closeDrawer } = useDrawer();
    const [attachments, setAttachments] = useState([]);
    const renderValue = (value) =>
        value === null || value === "" ? "-" : value;
    const fetchAttachments = async (jorfId) => {
        try {
            const res = await axios.get(route("jorf.attachments", jorfId));
            console.log("Fetched attachments:", res.data);
            setAttachments(res.data.attachments || []);
        } catch (err) {
            console.error("Error fetching attachments", err);
            setAttachments([]);
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
            render: renderValue,
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
            render: renderValue,
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => record.status_label,
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
                },
            ],
        },
        {
            title: "Handling",
            column: 2,
            fields: [
                {
                    key: "handled_by",
                    label: "Handled By",
                    dataIndex: "handled_by",
                },
                {
                    key: "handled_at",
                    label: "Handled At",
                    dataIndex: "handled_at",
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                {Object.entries(statusCounts).map(([title, data]) => {
                    const Icon = iconMap[title] || AppstoreOutlined;
                    return (
                        <StatCard
                            key={title}
                            title={title}
                            value={data.count}
                            color={data.color}
                            icon={Icon}
                            onClick={handleStatusFilter}
                            isActive={activeFilter === title}
                            filterType={title}
                        />
                    );
                })}
            </div>

            <Card>
                <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                    <Input
                        placeholder="Search JORF..."
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                        prefix={<SearchOutlined />}
                        style={{ width: 256 }}
                        size="middle"
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
                            console.log("Row clicked:", record.jorf_id);
                            openDrawer(record);
                            await fetchAttachments(record.jorf_id);
                        },
                        style: { cursor: "pointer" },
                    })}
                />
            </Card>
            <JorfDrawer
                open={drawerOpen}
                onClose={closeDrawer}
                item={selectedItem}
                attachments={attachments}
                fieldGroups={jorfFieldGroups}
                title={(item) => `JORF Details: ${item?.jorf_id}`}
                headerBadges={headerBadges}
            />
        </AuthenticatedLayout>
    );
};

export default JorfTable;
