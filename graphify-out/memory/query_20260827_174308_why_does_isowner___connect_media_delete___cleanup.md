---
type: "query"
date: "2026-08-27T17:43:08.578403+00:00"
question: "Why does isOwner() connect Media Delete & Cleanup Lambda to Invite Email Lambda, Stats/Cost Dashboard Lambda, Activity Log Lambda, API Testing Proxy Lambda, Folder Access Resolution, Playlists Lambda Handler, Folder Share Notifications, Multipart Upload Lambda?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["isOwner()", "handler()", "deleteMedia()", "updateMedia()", "Cognito Owner-group Authorizer", "lambda_function.py"]
---

# Q: Why does isOwner() connect Media Delete & Cleanup Lambda to Invite Email Lambda, Stats/Cost Dashboard Lambda, Activity Log Lambda, API Testing Proxy Lambda, Folder Access Resolution, Playlists Lambda Handler, Folder Share Notifications, Multipart Upload Lambda?

## Answer

Expanded from original query via vocab: [owner, media, delete, cleanup, handler, lambda, access]. Then traversed DFS depth=2 from isOwner()-adjacent seed nodes. isOwner() (infra/lambda/media/authz.ts:13) is a single Owner-vs-Member check imported directly into every protected Lambda handler file in apps/media-app's backend (media-access.ts, playlists.ts, and per the full report also invites.ts, activity.ts, stats.ts, access.ts, upload-url.ts) - it bridges communities because authorization is cross-cutting, not because of messy coupling. Separately, apps/playground has its own independent parallel gate (a Cognito Owner-group API-Gateway JWT authorizer, not a callable function) that bridges its own communities (Archive/Delete Company Lambda, API Testing Proxy Lambda) the same way - two apps, two different mechanisms, same underlying access-control concept, sharing one Cognito User Pool but no code.

## Outcome

- Signal: useful

## Source Nodes

- isOwner()
- handler()
- deleteMedia()
- updateMedia()
- Cognito Owner-group Authorizer
- lambda_function.py