import { NextRequest, NextResponse } from 'next/server';

function getAllowedOrigins() {
  const raw = process.env.CORS_ALLOWED_ORIGINS ?? '';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveOrigin(requestOrigin: string | null, allowedOrigins: string[]) {
  if (!requestOrigin) return allowedOrigins[0] ?? '*';
  if (allowedOrigins.includes('*')) return '*';
  if (allowedOrigins.includes(requestOrigin)) return requestOrigin;
  return allowedOrigins[0] ?? requestOrigin;
}

function withCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-payment, x-api-key');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Vary', 'Origin');
  return response;
}

export function proxy(request: NextRequest) {
  const allowedOrigins = getAllowedOrigins();
  const origin = resolveOrigin(request.headers.get('origin'), allowedOrigins);

  if (request.method === 'OPTIONS') {
    return withCorsHeaders(new NextResponse(null, { status: 204 }), origin);
  }

  return withCorsHeaders(NextResponse.next(), origin);
}

export const config = {
  matcher: ['/api/:path*'],
};
