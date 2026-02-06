import React from "react";
import { Col, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function TableToolbar({ searchValue, onSearch }) {
    return (
        <Row justify="end" align="middle" style={{ marginBottom: 16 }}>
            <Col>
                <Input
                    placeholder="Search JORF..."
                    prefix={<SearchOutlined />}
                    value={searchValue}
                    onChange={(e) => onSearch(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </Col>
        </Row>
    );
}
