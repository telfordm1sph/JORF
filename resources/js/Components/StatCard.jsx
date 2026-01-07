import React from "react";
import { Card, Tag } from "antd";

export default function StatCard({
    title,
    value,
    color = "default", // Ant Design preset color name
    icon: Icon,
    onClick,
    isActive,
    filterType,
}) {
    return (
        <Card
            hoverable
            onClick={() => onClick(filterType)}
            style={{
                borderRadius: "16px",
                border: isActive ? `2px solid` : undefined,
                boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.15)" : undefined,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <Tag
                        color={color}
                        style={{ fontWeight: 600, marginBottom: 8 }}
                    >
                        {title}
                    </Tag>
                    <p
                        className={`ant-tag-${color}`}
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        }}
                    >
                        {value}
                    </p>
                </div>
                {Icon && (
                    <Icon
                        className={`ant-tag-${color}`}
                        style={{ fontSize: 28 }}
                    />
                )}
            </div>
        </Card>
    );
}
