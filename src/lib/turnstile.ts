import { serverEnv } from "./env";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export async function verifyTurnstileToken(
  token: string | undefined,
  ip?: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  const isProduction = serverEnv.NODE_ENV === "production";

  // In production, missing secret key must NEVER succeed
  if (isProduction) {
    if (!serverEnv.TURNSTILE_SECRET_KEY) {
      return {
        success: false,
        errorCodes: ["missing-turnstile-secret-key-in-production"],
      };
    }
  } else {
    // Explicit documented development/test bypass: Allowed only when TURNSTILE_SECRET_KEY is empty in dev/test
    if (!serverEnv.TURNSTILE_SECRET_KEY) {
      return { success: true };
    }
  }

  if (!token || typeof token !== "string" || !token.trim()) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", serverEnv.TURNSTILE_SECRET_KEY);
    formData.append("response", token.trim());
    if (ip) {
      formData.append("remoteip", ip);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    if (!res.ok) {
      return {
        success: false,
        errorCodes: [`http-${res.status}`],
      };
    }

    const data = (await res.json()) as TurnstileVerifyResponse;
    return {
      success: Boolean(data.success),
      errorCodes: data["error-codes"],
    };
  } catch {
    // Log generic error without logging token, secret, or PII
    console.error("Turnstile verification request failed");
    return {
      success: false,
      errorCodes: ["turnstile-request-failed"],
    };
  }
}
