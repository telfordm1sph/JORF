<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JorfController;



$app_name = $app_name ?? env('APP_NAME', 'app');
// dd($app_name);
Route::prefix($app_name)

    ->group(function () {

        // jorf
        Route::get('/jorf', [JorfController::class, 'index'])->name('jorf.form');
        Route::post('/jorf/store', [JorfController::class, 'store'])->name('jorf.store');

        // jorf table
        Route::get('/jorf/table', [JorfController::class, 'getJorfTable'])->name('jorf.table');
        Route::get('/jorf/{jorfId}/attachments', [JorfController::class, 'getAttachments'])
            ->name('jorf.attachments');

        Route::get('/jorf/attachments/download/{id}', [JorfController::class, 'downloadAttachment'])
            ->name('jorf.attachments.download');
    });
