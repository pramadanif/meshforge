import { createThirdwebClient } from 'thirdweb';
import { celoSepoliaTestnet } from 'thirdweb/chains';
import { facilitator, settlePayment } from 'thirdweb/x402';

const getEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
};

const x402SecretKey = getEnv('THIRDWEB_SECRET_KEY', 'THIRDWEB_X402_API_KEY', 'THIRDWEB_API_KEY');
const x402ServerWallet = getEnv('THIRDWEB_SERVER_WALLET') as `0x${string}` | undefined;

const client = x402SecretKey
  ? createThirdwebClient({ secretKey: x402SecretKey })
  : null;

const thirdwebX402Facilitator = client && x402ServerWallet
  ? facilitator({
      client,
      serverWalletAddress: x402ServerWallet,
    })
  : null;

export function isX402Configured() {
  return Boolean(client && thirdwebX402Facilitator);
}

export async function settleX402Request(params: {
  request: Request;
  resourceUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  price: string;
}) {
  if (!thirdwebX402Facilitator) {
    return {
      ok: false as const,
      status: 500,
      responseBody: {
        error: 'x402 is not configured. Set THIRDWEB_SECRET_KEY and THIRDWEB_SERVER_WALLET.',
      },
      responseHeaders: {},
    };
  }

  let result;
  try {
    result = await settlePayment({
      resourceUrl: params.resourceUrl,
      method: params.method,
      paymentData: params.request.headers.get('x-payment'),
      network: celoSepoliaTestnet,
      price: params.price,
      facilitator: thirdwebX402Facilitator,
    });
  } catch (error) {
    return {
      ok: false as const,
      status: 502,
      responseBody: {
        error: 'x402 settlement call failed',
        detail: error instanceof Error ? error.message : 'unknown error',
      },
      responseHeaders: {},
    };
  }

  if (result.status === 200) {
    return { ok: true as const, result };
  }

  return {
    ok: false as const,
    status: result.status,
    responseBody: result.responseBody,
    responseHeaders: result.responseHeaders,
  };
}
