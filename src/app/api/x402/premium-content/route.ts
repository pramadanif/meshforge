import { NextResponse } from 'next/server';
import { isX402Configured, settleX402Request } from '@/lib/x402';

export async function GET(request: Request) {
  if (!isX402Configured()) {
    return NextResponse.json(
      {
        error: 'x402 is not configured on server',
        requiredEnv: ['THIRDWEB_SECRET_KEY', 'THIRDWEB_SERVER_WALLET'],
      },
      { status: 500 }
    );
  }

  const settlement = await settleX402Request({
    request,
    resourceUrl: new URL(request.url).toString(),
    method: 'GET',
    price: '$0.01',
  });

  if (!settlement.ok) {
    return new NextResponse(JSON.stringify(settlement.responseBody), {
      status: settlement.status,
      headers: settlement.responseHeaders,
    });
  }

  return NextResponse.json({
    data: 'MeshForge premium coordination feed',
    network: 'celoSepolia',
    price: '$0.01',
    payment: 'settled',
  });
}
