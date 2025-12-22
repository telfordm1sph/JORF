<?php

namespace App\Repositories;

use App\Models\RequestType;
use App\Models\Jorf;
use App\Models\JorfAttachments;

class JorfRepository
{
    public function getRequestType()
    {
        return RequestType::all();
    }

    public function createJorf(array $data): Jorf
    {
        return Jorf::create($data);
    }

    public function createAttachment(array $data): JorfAttachments
    {
        return JorfAttachments::create($data);
    }
    public function generateJorfNumber(): string
    {
        $year = date('Y');
        $prefix = "JORF-{$year}-";

        $lastJorfNumber = Jorf::where('jorf_id', 'like', "{$prefix}%")
            ->orderBy('jorf_id', 'desc')
            ->first();

        $newNumber = $lastJorfNumber
            ? ((int) substr($lastJorfNumber->jorf_id, -3)) + 1
            : 1;

        return $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
