import { usePage } from "@inertiajs/react";

import SidebarLink from "@/Components/sidebar/SidebarLink";

import { ClipboardList, FileText, Settings, SheetIcon } from "lucide-react";
import { UserAddOutlined } from "@ant-design/icons";
import Dropdown from "./DropDown";

export default function NavLinks({ isSidebarOpen }) {
    const { emp_data } = usePage().props;
    // console.log("Nav", emp_data);
    const adminLinks = [
        {
            href: route("requestType.form"),
            label: "Request Types",
            icon: <ClipboardList className="text-base" />,
        },
        {
            href: route("requestor.form"),
            label: "Add Requestor",
            icon: <UserAddOutlined className="text-base" />,
        },
        // other admin links here
    ];
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
                icon={<SheetIcon className="w-5 h-5" />}
                label="JORF Table"
                isSidebarOpen={isSidebarOpen}
            />
            {emp_data?.emp_system_roles?.includes("Facilities_Coordinator") && (
                <Dropdown
                    label="Admin"
                    icon={<Settings className="w-5 h-5" />}
                    links={adminLinks}
                    isSidebarOpen={isSidebarOpen}
                />
            )}
        </nav>
    );
}
