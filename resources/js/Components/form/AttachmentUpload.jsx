import React, { useState } from "react";
import { Upload, Image, message } from "antd";
import {
    FileOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FilePptOutlined,
    FileImageOutlined,
    DeleteOutlined,
    EyeOutlined,
    DownloadOutlined,
    PaperClipOutlined,
} from "@ant-design/icons";

const AttachmentUpload = ({
    onFilesChange,
    multiple = true,
    maxCount = null,
    viewOnly = false,
    existingFiles = [],
}) => {
    const [fileList, setFileList] = useState([]);

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const beforeUpload = (file) => {
        if (!allowedTypes.includes(file.type)) {
            message.error(`${file.name} is not a supported file type`);
            return Upload.LIST_IGNORE;
        }
        if (file.size / 1024 / 1024 > 10) {
            message.error("File must be smaller than 10MB");
            return Upload.LIST_IGNORE;
        }
        return false; // prevent auto upload
    };

    const handleChange = ({ fileList: newList }) => {
        setFileList(newList);

        const files = newList.map((f) => f.originFileObj).filter(Boolean);
        onFilesChange?.(files);
    };

    const handleRemove = (file) => {
        const newList = fileList.filter((f) => f.uid !== file.uid);
        setFileList(newList);

        const files = newList.map((f) => f.originFileObj).filter(Boolean);
        onFilesChange?.(files);
    };

    const handleDownload = (file, isExisting = false) => {
        const link = document.createElement("a");
        link.href = isExisting
            ? file.url
            : URL.createObjectURL(file.originFileObj);
        link.download = file.name;
        link.click();
    };

    const getFileIcon = (type) => {
        if (type?.startsWith("image/")) return <FileImageOutlined />;
        if (type === "application/pdf") return <FilePdfOutlined />;
        if (type?.includes("word")) return <FileWordOutlined />;
        if (type?.includes("presentation")) return <FilePptOutlined />;
        return <FileOutlined />;
    };

    const renderFileItem = (file, isExisting = false, index) => {
        const isImage = file.type?.startsWith("image/");
        const fileUrl = isExisting
            ? file.url
            : URL.createObjectURL(file.originFileObj);

        return (
            <div
                key={file.uid || index}
                className="flex items-center justify-between border rounded-lg p-3"
            >
                <div className="flex items-center gap-3">
                    {isImage ? (
                        <Image
                            width={50}
                            height={50}
                            src={fileUrl}
                            style={{ objectFit: "cover" }}
                            preview={{
                                src: fileUrl, // FULL AntD viewer (zoom/rotate)
                            }}
                        />
                    ) : (
                        <div className="text-xl">{getFileIcon(file.type)}</div>
                    )}

                    <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isImage && (
                        <EyeOutlined
                            onClick={() => handleDownload(file, isExisting)}
                            style={{ cursor: "pointer" }}
                        />
                    )}

                    {!viewOnly && (
                        <DeleteOutlined
                            onClick={() => handleRemove(file)}
                            style={{ cursor: "pointer", color: "red" }}
                        />
                    )}
                </div>
            </div>
        );
    };

    const displayFiles = viewOnly ? existingFiles : fileList;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {!viewOnly && (
                <Upload
                    multiple={multiple}
                    maxCount={maxCount}
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    showUploadList={false}
                >
                    <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer">
                        <PaperClipOutlined className="text-3xl mb-2" />
                        <p>Click or drag files to upload</p>
                        <small>Images, PDF, Word, PPT (max 10MB)</small>
                    </div>
                </Upload>
            )}

            {displayFiles.length > 0 && (
                <div className="space-y-2">
                    {displayFiles.map((file, index) =>
                        renderFileItem(file, viewOnly, index),
                    )}
                </div>
            )}
        </div>
    );
};

export default AttachmentUpload;
