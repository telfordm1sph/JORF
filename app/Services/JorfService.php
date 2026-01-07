<?php

namespace App\Services;

use App\Constants\Status;
use App\Models\Masterlist;
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

    public function getRequestType()
    {
        return $this->jorfRepository->getRequestType();
    }

    public function store(Request $request, array $empData): void
    {
        DB::transaction(function () use ($request, $empData) {
            $employeeData = [
                'employid'   => $empData['emp_id'] ?? $empData['EMPLOYID'] ?? null,
                'empname'    => $empData['emp_name'] ?? $empData['EMPNAME'] ?? null,
                'department' => $empData['emp_dept'] ?? $empData['DEPARTMENT'] ?? 'Unknown',
                'prodline'   => $empData['emp_prodline'] ?? $empData['PRODLINE'] ?? 'Unknown',
                'station'    => $empData['emp_station'] ?? $empData['STATION'] ?? 'Unknown',
            ];

            if (!$employeeData['employid'] || !$employeeData['empname']) {
                throw new \InvalidArgumentException('Employee ID and Name are required.');
            }

            $jorfNumber = $this->jorfRepository->generateJorfNumber();

            $jorf = $this->jorfRepository->createJorf(array_merge($employeeData, [
                'jorf_id'      => $jorfNumber,
                'request_type' => $request->request_type,
                'details'      => $request->request_details,
                'status'       => 1,
                'created_by'   => $employeeData['employid'],
            ]));

            $this->storeAttachments($request->file('attachments', []), $jorfNumber, $employeeData['employid']);
        });
    }

    protected function storeAttachments(array $attachments, string $jorfNumber, string $employeeId): void
    {
        foreach ($attachments as $file) {
            $path = $file->store(
                "jorf_attachments/{$employeeId}/{$jorfNumber}",
                'public'
            );

            $this->jorfRepository->createAttachment([
                'jorf_id'     => $jorfNumber,
                'file_name'   => $file->getClientOriginalName(),
                'file_path'   => $path,
                'file_size'   => $file->getSize(),
                'file_type'   => $file->getClientMimeType(),
                'uploaded_by' => $employeeId,
                'uploaded_at' => now(),
            ]);
        }
    }

    /**
     * Get paginated JORF table with filters, search, sort
     */
    public function getJorfDataTable(array $filters, array $empData): array
    {
        // ----- Base Queries -----
        $tableQuery = $this->applyRoleFilters($this->jorfRepository->query(), $empData);
        $countQuery = $this->applyRoleFilters($this->jorfRepository->query(), $empData);

        // ----- Apply status filter only for table -----
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $tableQuery->where('status', $filters['status']);
        }

        // ----- Apply request type filter only for table -----
        if (!empty($filters['requestType'])) {
            $tableQuery->where('request_type', $filters['requestType']);
        }

        // ----- Apply search filter only for table -----
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $tableQuery->where(function ($q) use ($search) {
                $q->where('jorf_id', 'like', "%{$search}%")
                    ->orWhere('empname', 'like', "%{$search}%")
                    ->orWhere('employid', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('prodline', 'like', "%{$search}%")
                    ->orWhere('details', 'like', "%{$search}%");
            });
        }

        // ----- Sorting & Pagination -----
        $sortField = $filters['sortField'] ?? 'created_at';
        $sortOrder = $filters['sortOrder'] ?? 'desc';
        $tableQuery->orderBy($sortField, $sortOrder);

        $page     = $filters['page'] ?? 1;
        $pageSize = $filters['pageSize'] ?? 10;
        $paginated = $tableQuery->paginate($pageSize, ['*'], 'page', $page);

        // ----- Status counts (unfiltered by status) -----
        $countQuery->getQuery()->orders = []; // remove orderBy for count query
        $statusCounts = $this->jorfRepository->getStatusCountsFromQuery($countQuery);

        // ----- Prepare table data -----
        $data = collect($paginated->items())->map(function ($jorf) {
            return [
                ...$jorf->toArray(),
                'status_label' => Status::getLabel($jorf->status),
                'status_color' => Status::getColor($jorf->status),
            ];
        });

        return [
            'data' => $data,
            'pagination' => [
                'current'     => $paginated->currentPage(),
                'currentPage' => $paginated->currentPage(),
                'lastPage'    => $paginated->lastPage(),
                'total'       => $paginated->total(),
                'perPage'     => $paginated->perPage(),
                'pageSize'    => $paginated->perPage(),
            ],
            'statusCounts' => $statusCounts,
            'filters'      => $filters,
        ];
    }

    /**
     * Apply role-based filters to a query.
     */
    protected function applyRoleFilters($query, array $empData)
    {
        $currentEmpId = $empData['emp_id'] ?? null;
        $userRoles    = $empData['user_roles'] ?? '';
        $systemRoles  = $empData['system_roles'] ?? [];

        // Department Head → only see requestors under them
        if ($userRoles === 'DEPARTMENT_HEAD' && $currentEmpId) {
            $requestorIds = Masterlist::where('APPROVER2', $currentEmpId)
                ->orWhere('APPROVER3', $currentEmpId)
                ->pluck('EMPLOYID');
            $query->whereIn('employid', $requestorIds);
        }
        // Facilities → see only status != 1
        elseif (in_array('Facilities', $systemRoles)) {
            $query->where('status', '!=', 1);
        }

        return $query;
    }



    public function getAttachments(string $jorfId): array
    {
        $attachments = $this->jorfRepository->getAttachmentsByJorfId($jorfId);

        return $attachments->map(function ($attachment) {
            return [
                'id' => $attachment->id,
                'jorf_id' => $attachment->jorf_id,
                'file_name' => $attachment->file_name,
                'file_path' => $attachment->file_path,
                'file_size' => $attachment->file_size,
                'file_type' => $attachment->file_type,
                'uploaded_by' => $attachment->uploaded_by,
                'uploaded_at' => $attachment->uploaded_at,
            ];
        })->toArray();
    }
}
