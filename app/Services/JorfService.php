<?php

namespace App\Services;

use App\Constants\Status;
use App\Repositories\JorfRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JorfService
{
    protected JorfRepository $jorfRepository;

    public function __construct(JorfRepository $jorfRepository)
    {
        $this->jorfRepository = $jorfRepository;
    }
    /**
     * Get the list of request types
     */
    public function getRequestType()
    {
        return $this->jorfRepository->getRequestType();
    }

    /**
     * Store a new JORF with attachments
     */
    public function store(Request $request, array $empData): void
    {
        DB::transaction(function () use ($request, $empData) {

            // Normalize employee data
            $employeeData = [
                'employid'   => $empData['emp_id'] ?? $empData['EMPLOYID'] ?? null,
                'empname'    => $empData['emp_name'] ?? $empData['EMPNAME'] ?? null,
                'department' => $empData['emp_dept'] ?? $empData['DEPARTMENT'] ?? 'Unknown',
                'prodline'   => $empData['emp_prodline'] ?? $empData['PRODLINE'] ?? 'Unknown',
                'station'    => $empData['emp_station'] ?? $empData['STATION'] ?? 'Unknown',
            ];

            // Ensure required employee data exists
            if (!$employeeData['employid'] || !$employeeData['empname']) {
                throw new \InvalidArgumentException('Employee ID and Name are required.');
            }

            // Generate JORF number
            $jorfNumber = $this->jorfRepository->generateJorfNumber();

            // Create JORF record
            $jorf = $this->jorfRepository->createJorf(array_merge($employeeData, [
                'jorf_id'      => $jorfNumber,
                'request_type' => $request->request_type,
                'details'      => $request->request_details,
                'status'       => Status::PENDING,
                'created_by'   => $employeeData['employid'],
            ]));

            // Store attachments if any
            $this->storeAttachments(
                $request->file('attachments', []),
                $jorfNumber,
                $employeeData['employid']
            );
        });
    }

    /**
     * Store uploaded attachments for a JORF
     */
    protected function storeAttachments(array $attachments, string $jorfNumber, string $employeeId): void
    {
        foreach ($attachments as $file) {
            // Generate safe path
            $path = $file->store(
                "jorf_attachments/" . Str::slug($employeeId) . "/" . Str::slug($jorfNumber),
                'public'
            );

            $this->jorfRepository->createAttachment([
                'jorf_id'      => $jorfNumber,
                'file_name'    => $file->getClientOriginalName(),
                'file_path'    => $path,
                'file_size'    => $file->getSize(),
                'file_type'    => $file->getClientMimeType(),
                'uploaded_by'  => $employeeId,
                'uploaded_at'  => now(),
            ]);
        }
    }
}
