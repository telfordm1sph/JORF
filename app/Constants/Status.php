<?php

namespace App\Constants;

class Status
{
    // Status values
    const PENDING = 1;
    const ONGOING = 2;
    const DONE = 3;
    const CANCELLED = 4;

    // Status labels
    const LABELS = [
        self::PENDING => 'Pending',
        self::ONGOING => 'Ongoing',
        self::DONE => 'Done',
        self::CANCELLED => 'Cancelled',
    ];



    // Status colors for UI
    const COLORS = [
        self::PENDING => 'green',
        self::ONGOING => 'blue',
        self::DONE => 'gray',
        self::CANCELLED => 'red',
    ];

    /**
     * Get status label by value
     *
     * @param int $status
     * @return string
     */
    public static function getLabel(int $status): string
    {
        return self::LABELS[$status] ?? 'Unknown';
    }


    public static function getColor(int $status): string
    {
        return self::COLORS[$status] ?? 'default';
    }

    /**
     * Get status value by label
     *
     * @param string $label
     * @return int|null
     */
    public static function getValueByLabel(string $label): ?int
    {
        $flipped = array_flip(self::LABELS);
        return $flipped[$label] ?? null;
    }
}
