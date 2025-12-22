<?php

namespace App\Http\Controllers;

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
}
