import crypto from "crypto";
import { serverEnv } from "./env";

export function extractIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

export function hashIp(ip: string): string {
  const salt = serverEnv.IP_HASH_SALT || "default-dev-salt-change-in-production";
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex");
}
