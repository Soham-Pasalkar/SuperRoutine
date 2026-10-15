# 07 — Payments (Razorpay) — BUILD BEHIND A FLAG, KEEP OFF

`NEXT_PUBLIC_PAYMENTS_ENABLED=false` by default. When false: no Razorpay script loads, no payment UI renders, payment routes return `404`. **Do not enable** — product, testing and licensing are not ready. Purpose of this module: make adding a *refundable founding-spot deposit* later a config change, not a rewrite.

## Flow (Razorpay Orders + Standard Checkout)
1. Client calls `POST /api/payments/create-order` with `{ signupId }`. Server computes the amount (config constant, integer **paise**), creates a Razorpay order (`receipt = signup id`), stores a `payments` row (`status = created`), returns `{ orderId, amount, currency, keyId }`.
2. Client loads `checkout.js` **only when enabled**, opens Checkout with the order id.
3. On success the client sends `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` to `POST /api/payments/verify`. Server verifies `HMAC_SHA256(order_id + "|" + payment_id, KEY_SECRET)` using a constant-time compare. A browser callback alone **never** marks a payment paid.
4. **Webhook** `POST /api/payments/webhook` is the source of truth: verify `X-Razorpay-Signature` against the **raw body** with `RAZORPAY_WEBHOOK_SECRET`; dedupe on the `X-Razorpay-Event-Id` header (unique column in `webhook_events`); handle `payment.captured`, `payment.failed`, `refund.processed`; process idempotently.
5. Refunds via the Refunds API from a server script/admin action only.

## Tables (migration `0002_payments.sql`)
`payments(id, signup_id fk, razorpay_order_id unique, razorpay_payment_id unique null, amount_paise int, currency text default 'INR', status text check in ('created','authorized','captured','failed','refunded'), created_at, updated_at)` and `webhook_events(event_id text primary key, type text, received_at timestamptz default now(), payload jsonb)`. RLS enabled, no policies.

## Rules
- Amounts are integer paise, never floats. Currency stored explicitly.
- Keys only from server env; `KEY_ID` may be returned to the client, `KEY_SECRET` never.
- Terms must state the deposit is refundable and how to request it; show them before payment.
- Tests: signature verification (valid/invalid/tampered), duplicate webhook, failed payment, refund. Use Razorpay **test mode** only.
- Methods (UPI, cards, netbanking) are configured in the Razorpay dashboard; verify availability for the merchant account.
