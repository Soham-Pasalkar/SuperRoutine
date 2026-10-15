import { normalizePhone } from "../src/lib/phone";
import { deleteWaitlistSignupByPhone } from "../src/lib/supabase-server";

async function main() {
  const inputPhone = process.argv[2];
  if (!inputPhone) {
    console.error("Usage: tsx scripts/delete-signup.ts <phone_number>");
    process.exit(1);
  }

  const norm = normalizePhone(inputPhone);
  if (!norm.isValid) {
    console.error("Invalid phone number:", norm.error);
    process.exit(1);
  }

  console.log(`Attempting deletion for phone: ${norm.e164}...`);
  const success = await deleteWaitlistSignupByPhone(norm.e164);

  if (success) {
    console.log(`Successfully deleted record for ${norm.e164}`);
  } else {
    console.error(`Record not found or failed to delete for ${norm.e164}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
