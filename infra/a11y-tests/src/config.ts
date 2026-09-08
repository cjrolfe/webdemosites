// Same non-secret posture as infra/regression-tests/src/config.ts, which
// this mirrors — public client-side identifiers, not credentials.
export const AWS_REGION = process.env.SWORDTHAIN_AWS_REGION ?? "us-east-1";
export const COGNITO_CLIENT_ID = process.env.SWORDTHAIN_COGNITO_CLIENT_ID ?? "71qr9fcrcspphp0n2p8htiq8ug";

// The live deployed site — same "hit the real thing" philosophy as
// infra/regression-tests, so this catches issues in the actual CloudFront-
// served build, not just a local dev server.
export const BASE_URL = process.env.SWORDTHAIN_A11Y_BASE_URL ?? "https://swordthain.com";

// Matches infra/regression-tests/src/config.ts's API_URL — used only by
// splash.spec.ts, to call PATCH /settings directly as Owner (the kill
// switch is a real backend setting, not something the browser alone can
// exercise).
export const API_URL = process.env.SWORDTHAIN_API_URL ?? "https://ox8boap6v6.execute-api.eu-west-1.amazonaws.com";

// Matches infra/lib/auth-stack.ts's regressionTestEmail/regressionTestOtpParam
// constants and infra/lib/ci-stack.ts's A11yTestCiRole grant — same fixed-OTP
// account infra/regression-tests uses, since it's Owner-privileged and
// already provisioned; no separate account needed just for this suite.
export const OWNER_TEST_EMAIL = process.env.REGRESSION_TEST_EMAIL ?? "ci-test@swordthain.com";
export const OWNER_TEST_OTP_PARAM = process.env.REGRESSION_TEST_OTP_PARAM ?? "/swordthain/regression-test/otp-code";
