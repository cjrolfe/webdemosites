# Swordthain Playground — Backlog

Deferred work, parked API integrations, and owner action items. Not a roadmap — just a place to look before assuming something is unbuilt or forgotten.

## API integrations — status

- **Ticketmaster** — done, working. Consumer Key stored in SSM, verified live against Discovery API v2. (Consumer Secret deliberately not stored — only the Discovery API's `apikey` query param is needed; the secret is for OAuth flows on other Ticketmaster products this doesn't use.)
- **VES (vehicle enquiry)** — production key works, verified live. UAT sandbox key is dead/expired. Parked — chase a fresh DVLA UAT credential only if sandbox testing is actually needed again. Now shares the "Vehicle APIs" page with MOT History (`api-testing/vehicle-apis/`).
- **MOT History (DVSA)** — done, working. First provider needing OAuth2 client-credentials auth (Client ID/Secret → bearer token) plus a separate API key, rather than one static secret — required extending `api-testing-proxy.ts`'s provider schema (`oauth2`/`ssmHeaderParameters`/`staticHeaders` on `ProviderDef`, a token-fetch-and-cache helper, retry-once-on-401). Verified live against a real registration with real DVSA test history returned.
- **TfL** — would extend the API-testing playground to a much larger integration (~79 endpoints), proving the established provider pattern (SSM-secret storage, `api-testing-proxy.ts`) scales beyond the smaller providers already done. Deferred — pattern's proven, just not started.
- **Animal Shelter** (What3Words + ChipNDoodle) — would add two more provider integrations to the playground. Deferred; needs splitting into two separate entries first, since it's really two unrelated providers bundled under one idea.
- **Charity Commission** — would add another provider integration. Skipped entirely, pending real connection details from the owner — not a rejection, just blocked on information only the owner has.

## Owner action items

- **Apple TV "Option A" test** (`docs/apple-tv-discovery.md`) — AirPlay a video from the media-app Lightbox to a real Apple TV and judge whether that alone is good enough, before considering a native/companion-app approach. Needs a real device — not something Claude can do.
