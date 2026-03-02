# Frontmatter Spec v1 (Course Lessons)

## Required (minimum)
```yaml
---
title: "..."
track: "core" # core|springboard
slug: "..." # url slug
---
```

## Recommended
```yaml
---
title: "..."
description: "..."
track: "core"
module: 3
lesson: 2
slug: "roof-workflow-and-qa"
audience: ["operator"]
estimated_minutes: 20
prereqs: []
---
```

## Defaults if omitted (during migration)
- `description`: blank
- `audience`: `["operator"]`
- `estimated_minutes`: null
- `prereqs`: []

## Rules
- slug must be unique within its track+module.
- Avoid changing filenames; URLs should come from `slug`.
- Keep chemistry details operator-safe for public pages; add gating later if needed.
