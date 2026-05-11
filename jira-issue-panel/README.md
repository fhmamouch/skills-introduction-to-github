# Jira Issue Panel — Quick Info

A Forge app that adds a **Quick Info** panel to Jira issues. The panel displays at-a-glance information including status, priority, assignee, comments count, and linked issues.

## Features

- Issue status with color-coded lozenge
- Priority indicator
- Comment count badge
- Assignee and reporter with user avatars
- Relative time for last update
- Linked issues table with relationship type, key, summary, and status

## Prerequisites

- [Node.js](https://nodejs.org/) v22+ (LTS)
- [Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/) (`npm install -g @forge/cli`)
- An [Atlassian cloud developer site](http://go.atlassian.com/cloud-dev)

## Setup

1. **Install the Forge CLI** (if not already installed):

   ```bash
   npm install -g @forge/cli
   ```

2. **Log in to Forge**:

   Create an API token at https://id.atlassian.com/manage/api-tokens, then:

   ```bash
   forge login
   ```

3. **Register the app** to get a valid app ID:

   ```bash
   cd jira-issue-panel
   forge register
   ```

   This updates `manifest.yml` with your unique app ID.

4. **Install dependencies**:

   ```bash
   npm install
   ```

## Deploy

```bash
forge deploy -e development
```

## Install on your site

```bash
forge install --site your-site.atlassian.net --product jira -e development
```

## Usage

After installation, open any Jira issue. Click the **Quick Info** button in the issue panel area (above the Activity section) to expand the panel and see:

- Current status and priority
- Assignee and reporter
- Number of comments
- All linked issues

## Project Structure

```
jira-issue-panel/
├── manifest.yml              # App configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript configuration
└── src/
    ├── index.ts              # Backend resolver
    ├── types.ts              # Shared type definitions
    └── frontend/
        └── index.tsx         # UI Kit frontend component
```

## Permissions

This app requires the following scopes:

| Scope | Purpose |
|-------|---------|
| `read:jira-work` | Read issue data (status, priority, links, comments) |
| `read:jira-user` | Read user display names and avatars |

## Development

To debug the app locally with live reloading:

```bash
forge tunnel
```

Check logs from the deployed app:

```bash
forge logs -e development
```

Validate the manifest:

```bash
forge lint
```
