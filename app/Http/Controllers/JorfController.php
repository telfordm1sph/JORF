<?php

namespace App\Http\Controllers;

use App\Models\JorfAttachments;
use App\Services\JorfService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JorfController extends Controller
{
    protected JorfService $jorfService;

    public function __construct(JorfService $jorfService)
    {
        $this->jorfService = $jorfService;
    }

    public function index(): Response
    {
        $requestType = $this->jorfService->getRequestType();

        return Inertia::render('Jorf/Form', [
            'requestType' => $requestType,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'request_type' => 'required',
            'request_details' => 'required',
            'attachments.*' => 'file|max:10240',
        ]);

        $empData = session('emp_data');

        $this->jorfService->store($request, $empData);

        return redirect()->back()->with('success', 'JORF created successfully.');
    }

    public function getJorfTable(Request $request)
    {
        $empData = session('emp_data');
        // Decode base64 filters
        $filters = $this->decodeFilters($request->input('f', ''));

        // Validate and set defaults
        $filters = [
            'page' => (int) ($filters['page'] ?? 1),
            'pageSize' => (int) ($filters['pageSize'] ?? 10),
            'search' => trim($filters['search'] ?? ''),
            'sortField' => $filters['sortField'] ?? 'created_at',
            'sortOrder' => $filters['sortOrder'] ?? 'desc',
            'status' => $filters['status'] ?? '',
            'requestType' => $filters['requestType'] ?? '',
        ];
        // dd($empData);
        $result = $this->jorfService->getJorfDataTable($filters, $empData);
        // dd($result);
        return Inertia::render('Jorf/JorfTable', [
            'jorfs' => $result['data'],
            'pagination' => $result['pagination'],
            'statusCounts' => $result['statusCounts'],
            'filters' => $result['filters'],
        ]);
    }
    /**
     * Get attachments for a specific JORF
     */
    public function getAttachments(string $jorfId)
    {
        $attachments = $this->jorfService->getAttachments($jorfId);

        // Convert file_path to public URL
        $attachments = array_map(function ($attachment) {
            return [
                'id' => $attachment['id'],
                'jorf_id' => $attachment['jorf_id'],
                'file_name' => $attachment['file_name'],
                'file_path' => asset('storage/' . $attachment['file_path']), // <-- public URL
                'file_size' => $attachment['file_size'],
                'file_type' => $attachment['file_type'],
                'uploaded_by' => $attachment['uploaded_by'],
                'uploaded_at' => $attachment['uploaded_at'],
            ];
        }, $attachments);

        return response()->json(['attachments' => $attachments]);
    }


    /**
     * Download attachment
     */
    public function downloadAttachment(int $id)
    {
        try {
            $attachment = JorfAttachments::findOrFail($id);

            $filePath = storage_path('app/public/' . $attachment->file_path);

            if (!file_exists($filePath)) {
                abort(404, 'File not found');
            }

            return response()->download($filePath, $attachment->file_name);
        } catch (\Exception $e) {
            abort(404, 'Attachment not found');
        }
    }
    /**
     * Helper to decode base64 JSON filters
     */
    protected function decodeFilters(string $encoded): array
    {
        $decoded = base64_decode($encoded);
        return $decoded ? json_decode($decoded, true) : [];
    }
}
