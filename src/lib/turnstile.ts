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
  // If no secret key is configured (dev / test environment), bypass verification
  if (!serverEnv.TURNSTILE_SECRET_KEY) {
    return { success: true };
  }

  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", serverEnv.TURNSTILE_SECRET_KEY);
    formData.append("response", token);
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
      success: data.success,
      errorCodes: data["error-codes"],
    };
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return {
      success: false,
      errorCodes: ["turnstile-request-failed"],
    };
  }
}
