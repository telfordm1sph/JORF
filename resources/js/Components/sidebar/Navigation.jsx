import { usePage } from "@inertiajs/react";

import SidebarLink from "@/Components/sidebar/SidebarLink";
import Dropdown from "@/Components/sidebar/Dropdown";
import { ClipboardList, FileText } from "lucide-react";
import { TableOutlined } from "@ant-design/icons";

export default function NavLinks({ isSidebarOpen }) {
    const { emp_data } = usePage().props;

    return (
        <nav
            className="flex flex-col flex-grow space-y-1 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
        >
            <SidebarLink
                href={route("jorf.form")}
                icon={<FileText className="w-5 h-5" />}
                label="Generate JORF"
                isSidebarOpen={isSidebarOpen}
            />
            <SidebarLink
                href={route("jorf.table")}
                icon={<TableOutlined className="w-5 h-5" />}
                label="JORF Table"
                isSidebarOpen={isSidebarOpen}
            />
            <SidebarLink
                href={route("requestType.form")}
                icon={<ClipboardList className="w-5 h-5" />}
                label="Request Types"
                isSidebarOpen={isSidebarOpen}
            />
        </nav>
    );
}
