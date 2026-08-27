---
type: "query"
date: "2026-08-27T17:51:27.766441+00:00"
question: "Trace jsonResponse() - why is it the #1 god node with 47 edges?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["jsonResponse()", "http.ts", "denyResponse()", "handler()"]
---

# Q: Trace jsonResponse() - why is it the #1 god node with 47 edges?

## Answer

Expanded from original query via vocab: [json, response, http]. Then traversed BFS depth=2 from jsonResponse()/http.ts. jsonResponse() (infra/lambda/media/http.ts:10-21) is an 11-line helper wrapping every API response with 5 hardening headers (x-robots-tag, HSTS, x-content-type-options, cache-control:no-store) - its own doc comment states this covers hardening requirements without a CDN layer in front of the API. 31 distinct functions across 9 Lambda handler files call it directly (folders.ts, playlists.ts, media-access.ts, upload-url.ts, shares.ts, invites.ts, activity.ts, stats.ts, verify-auth-challenge-response.ts) - essentially every HTTP-facing route in apps/media-app's backend, spanning 10 graph communities within 2 hops. It's the top god node not from architectural coupling but because it's a security-hardening choke point: every response gets the same headers enforced with zero chance of a route forgetting one, and it's also the single highest-blast-radius file if a header-logic bug were introduced.

## Outcome

- Signal: useful

## Source Nodes

- jsonResponse()
- http.ts
- denyResponse()
- handler()