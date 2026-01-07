import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

const statusMap = {
    All: "all",
    Pending: 1,
    Approved: 2,
    Ongoing: 3,
    Done: 4,
    Cancelled: 5,
    Disapproved: 6,
};

const encodeParams = (params) => {
    const filtered = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
    );
    return { f: btoa(JSON.stringify(filtered)) };
};

export default function useJorfTable({ initialFilters, pagination }) {
    // ─── State ─────────────────────────────
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [activeFilter, setActiveFilter] = useState(
        initialFilters?.status || "all"
    );
    const [filters, setFilters] = useState(initialFilters || {});

    // ─── Refs ──────────────────────────────
    const searchTimeoutRef = useRef(null);

    // ─── Effects ───────────────────────────
    useEffect(() => {
        setSearchValue(filters?.search || "");
        if (filters?.status) {
            const labelKey = Object.keys(statusMap).find(
                (key) => statusMap[key] === filters.status
            );
            setActiveFilter(labelKey || "All");
        }
    }, [filters?.search, filters?.status]);

    // ─── Helpers ───────────────────────────
    const fetchTableData = (params) => {
        setLoading(true);
        router.get(route("jorf.table"), encodeParams(params), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    // ─── Handlers ──────────────────────────
    const handleStatusFilter = (filterType) => {
        setActiveFilter(filterType);

        const statusValue = statusMap[filterType] || "all";
        const params = {
            page: 1,
            pageSize: pagination?.per_page || 10,
            search: filters?.search || "",
            status: statusValue,
            sortField: filters?.sortField || "created_at",
            sortOrder: filters?.sortOrder || "desc",
        };
        fetchTableData(params);
    };

    const handleTableChange = (paginationData, _, sorter) => {
        const params = {
            page: paginationData.current,
            pageSize: paginationData.pageSize,
            search: filters?.search || "",
            status: statusMap[activeFilter] || "all",
            sortField: sorter?.field || "created_at",
            sortOrder: sorter?.order === "ascend" ? "asc" : "desc",
        };
        fetchTableData(params);
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(() => {
            const params = {
                page: 1,
                pageSize: pagination?.per_page || 10,
                search: value,
                status: statusMap[activeFilter] || "all",
                sortField: filters?.sortField || "created_at",
                sortOrder: filters?.sortOrder || "desc",
            };
            fetchTableData(params);
        }, 500);
    };

    return {
        loading,
        searchValue,
        activeFilter,
        filters,
        setFilters,
        handleStatusFilter,
        handleTableChange,
        handleSearch,
    };
}
