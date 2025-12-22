<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // 1️⃣ Get token sources (priority: query → cookie → session)
        $tokenFromQuery   = $request->query('key');
        $tokenFromCookie  = $request->cookie('sso_token');
        $tokenFromSession = session('emp_data.token');

        $token = $tokenFromQuery ?? $tokenFromCookie ?? $tokenFromSession;

        Log::info('AuthMiddleware token check', [
            'query'   => $tokenFromQuery,
            'cookie'  => $tokenFromCookie,
            'session' => $tokenFromSession,
            'used'    => $token,
        ]);

        // 2️⃣ No token at all → redirect
        if (!$token) {
            return $this->redirectToLogin($request);
        }

        // 3️⃣ Session already exists AND token matches → trust it
        if (
            session()->has('emp_data') &&
            session('emp_data.token') === $token
        ) {
            // Clean URL if token came from query
            if ($tokenFromQuery) {
                return redirect($request->url());
            }

            return $next($request);
        }

        // 4️⃣ ONLY HERE we hit the DB (session missing or token mismatch)
        $currentUser = DB::connection('authify')
            ->table('authify_sessions')
            ->where('token', $token)
            ->first();

        if (!$currentUser) {
            session()->forget('emp_data');
            return $this->redirectToLogin($request);
        }

        // 5️⃣ Set session once
        session()->put('emp_data', [
            'token'         => $currentUser->token,
            'emp_id'        => $currentUser->emp_id,
            'emp_name'      => $currentUser->emp_name,
            'emp_firstname' => $currentUser->emp_firstname,
            'emp_jobtitle'  => $currentUser->emp_jobtitle,
            'emp_dept'      => $currentUser->emp_dept,
            'emp_prodline'  => $currentUser->emp_prodline,
            'emp_station'   => $currentUser->emp_station,
            'generated_at'  => $currentUser->generated_at,
        ]);

        // 6️⃣ Remove token from URL after successful login
        if ($tokenFromQuery) {
            return redirect($request->url());
        }

        return $next($request);
    }

    private function redirectToLogin(Request $request)
    {
        $redirectUrl = urlencode($request->fullUrl());
        return redirect("http://192.168.2.221/authify/public/login?redirect={$redirectUrl}");
    }
}
