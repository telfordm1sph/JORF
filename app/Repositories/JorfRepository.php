<?php

namespace App\Repositories;

use App\Constants\Status;
use App\Models\Jorf;
use App\Models\JorfAttachments;
use App\Models\RequestType;

class JorfRepository
{
    public function query()
    {
        return Jorf::query();
    }

    public function getRequestType()
    {
        return RequestType::all();
    }

    public function createJorf(array $data)
    {
        return Jorf::create($data);
    }

    public function createAttachment(array $data)
    {
        return JorfAttachments::create($data);
    }

    public function generateJorfNumber(): string
    {
        $year = date('Y');
        $prefix = "JORF-{$year}-";

        $lastJorf = Jorf::where('jorf_id', 'like', "{$prefix}%")
            ->orderBy('jorf_id', 'desc')
            ->first();

        $newNumber = $lastJorf ? ((int) substr($lastJorf->jorf_id, -3)) + 1 : 1;

        return $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
    public function getAllJorfs()
    {
        return Jorf::all()->map(function ($jorf) {
            return [
                'id'           => $jorf->id,
                'employid'     => $jorf->employid,
                'empname'      => $jorf->empname,
                'jorf_id'      => $jorf->jorf_id,
                'request_type' => $jorf->request_type,
                'details'      => $jorf->details,
                'status'       => $jorf->status,
                'status_label' => Status::getLabel($jorf->status),
                'status_color' => Status::getColor($jorf->status),
            ];
        });
    }

    public function getStatusCounts(): array
    {
        // Get counts grouped by status
        $statusCounts = Jorf::groupBy('status')
            ->selectRaw('status, COUNT(*) as count')
            ->pluck('count', 'status')
            ->toArray();

        $result = [];

        // Total of all statuses
        $total = array_sum($statusCounts);

        // Add "All" first
        $result['All'] = [
            'count' => $total,
            'color' => 'default', // or any color you want
        ];

        // Add each status based on labels
        foreach (Status::LABELS as $value => $label) {
            $result[$label] = [
                'count' => $statusCounts[$value] ?? 0,
                'color' => Status::COLORS[$value] ?? 'default',
            ];
        }

        return $result;
    }
    public function getStatusCountsFromQuery($query): array
    {
        $statusCounts = $query->clone()
            ->groupBy('status')
            ->selectRaw('status, COUNT(*) as count')
            ->pluck('count', 'status')
            ->toArray();

        $result = [];
        $total = array_sum($statusCounts);

        $result['All'] = [
            'count' => $total,
            'color' => 'default',
        ];

        foreach (Status::LABELS as $value => $label) {
            $result[$label] = [
                'count' => $statusCounts[$value] ?? 0,
                'color' => Status::COLORS[$value] ?? 'default',
            ];
        }

        return $result;
    }

    public function getJorfWithAttachments(int $id)
    {
        return Jorf::with(['attachments' => function ($query) {
            $query
                ->orderBy('uploaded_at', 'desc');
        }])->findOrFail($id);
    }

    public function getAttachmentsByJorfId(string $jorfId)
    {
        return JorfAttachments::where('jorf_id', $jorfId)

            ->orderBy('uploaded_at', 'desc')
            ->get();
    }
}
