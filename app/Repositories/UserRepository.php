<?php

namespace App\Repositories;

use App\Models\Masterlist;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserRepository
{

    /**
     * Check if user is a department head
     */
    public function isDepartmentHead(string $userId): bool
    {
        try {

            return Masterlist::where('ACCSTATUS', 1)
                ->where(function ($query) use ($userId) {
                    $query->where('APPROVER2', $userId)
                        ->orWhere('APPROVER3', $userId);
                })
                ->exists();
        } catch (\Exception $e) {
            Log::error("Failed to check department head status for user {$userId}: " . $e->getMessage());
            return false;
        }
    }
    public function findUserById(string $empId): ?object
    {
        return Masterlist::where('EMPLOYID', $empId)
            ->select([
                'EMPLOYID as emp_id',
                'EMPNAME as empname',
            ])
            ->first();
    }
    public function findDeptHeadOfRequestorById(string $empId): ?object
    {
        return Masterlist::where('EMPLOYID', $empId)
            ->where('ACCSTATUS', '1')
            ->select([
                'APPROVER2 as approver2',
                'APPROVER3 as approver3',
            ])
            ->first();
    }
    public function getFacilitiesCoordinator(): ?object
    {
        return Masterlist::where('DEPARTMENT', 'Facilities')
            ->where('JOB_TITLE', 'like', 'Facility Engineer%')
            ->where('ACCSTATUS', '1')
            ->select([
                'EMPLOYID as emp_id',
                'EMPNAME as empname',
            ])
            ->first();
    }

    public function getFacilitiesEmployees(): array
    {
        return Masterlist::where('DEPARTMENT', 'Facilities')
            ->where('ACCSTATUS', '1')
            ->select([
                'EMPLOYID as emp_id',
                'EMPNAME as empname',
            ])
            ->get()
            ->toArray();
    }
}
