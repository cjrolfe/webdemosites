---
type: "explain"
date: "2026-08-27T17:53:09.457504+00:00"
question: "What is the exact relationship between the architecture diagram page and Option A: AirPlay today, zero build?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["Swordthain Architecture diagram page", "Option A: AirPlay today, zero build"]
---

# Q: What is the exact relationship between the architecture diagram page and Option A: AirPlay today, zero build?

## Answer

Verified by reading both source files directly: infra/docs/architecture-diagram.html was grepped for 'airplay'/'apple tv'/'apple_tv' (case-insensitive) with zero matches - it is purely CDK-stack/Lambda/data-flow diagrams (familyBrowser, ownerBrowser, cliTool, ghIssues nodes, no TV-related content). docs/apple-tv-discovery.md is a real, well-formed discovery doc about Apple TV/AirPlay support, unrelated to the architecture diagram. There is no citation, shared concept, or structural link between the two files - the AMBIGUOUS edge is a false positive, likely from both files being batched into the same extraction chunk and topically co-occurring as 'docs about the app' with nothing more specific tying them together. The AMBIGUOUS flag correctly caught this for review rather than presenting it as fact.

## Outcome

- Signal: dead_end

## Source Nodes

- Swordthain Architecture diagram page
- Option A: AirPlay today, zero build