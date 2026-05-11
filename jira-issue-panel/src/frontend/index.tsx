import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
  Text,
  Heading,
  Stack,
  Inline,
  Box,
  Lozenge,
  Badge,
  Spinner,
  DynamicTable,
  User,
  xcss,
  SectionMessage,
} from '@forge/react';
import { invoke } from '@forge/bridge';
import { IssueDetails, LinkedIssue, ResolverResponse } from '../types';

const containerStyles = xcss({
  padding: 'space.200',
});

const sectionStyles = xcss({
  paddingTop: 'space.100',
  paddingBottom: 'space.100',
});

const metaCardStyles = xcss({
  backgroundColor: 'elevation.surface',
  padding: 'space.150',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderRadius: 'border.radius',
});

function getStatusAppearance(category: string): 'success' | 'moved' | 'inprogress' | 'default' {
  switch (category.toLowerCase()) {
    case 'done':
      return 'success';
    case 'in progress':
      return 'moved';
    case 'to do':
    default:
      return 'default';
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const LinkedIssuesTable = ({ issues }: { issues: LinkedIssue[] }) => {
  if (issues.length === 0) {
    return <Text>No linked issues</Text>;
  }

  const head = {
    cells: [
      { key: 'relationship', content: 'Relationship' },
      { key: 'key', content: 'Key' },
      { key: 'summary', content: 'Summary' },
      { key: 'status', content: 'Status' },
    ],
  };

  const rows = issues.map((issue, idx) => ({
    key: `${issue.key}-${idx}`,
    cells: [
      { key: 'relationship', content: issue.linkType },
      { key: 'key', content: issue.key },
      { key: 'summary', content: issue.summary.length > 40 ? issue.summary.substring(0, 40) + '...' : issue.summary },
      { key: 'status', content: issue.status },
    ],
  }));

  return <DynamicTable head={head} rows={rows} />;
};

const App = () => {
  const [details, setDetails] = useState<IssueDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await invoke<ResolverResponse>('getIssueDetails');
        setDetails(response.issueDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load issue details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <SectionMessage appearance="error" title="Error">
        <Text>{error}</Text>
      </SectionMessage>
    );
  }

  if (!details) {
    return <Text>No data available</Text>;
  }

  return (
    <Box xcss={containerStyles}>
      <Stack space="space.200">
        <Box xcss={sectionStyles}>
          <Inline space="space.200" alignBlock="center">
            <Stack space="space.050">
              <Text>Status</Text>
              <Lozenge appearance={getStatusAppearance(details.statusCategory)}>
                {details.status}
              </Lozenge>
            </Stack>
            <Stack space="space.050">
              <Text>Priority</Text>
              <Lozenge appearance="default">{details.priority}</Lozenge>
            </Stack>
            <Stack space="space.050">
              <Text>Comments</Text>
              <Badge appearance="primary">{details.commentCount}</Badge>
            </Stack>
          </Inline>
        </Box>

        <Box xcss={metaCardStyles}>
          <Stack space="space.100">
            <Inline space="space.100" alignBlock="center">
              <Text>Assignee:</Text>
              {details.assigneeAccountId ? (
                <User accountId={details.assigneeAccountId} />
              ) : (
                <Lozenge appearance="default">Unassigned</Lozenge>
              )}
            </Inline>
            <Inline space="space.100" alignBlock="center">
              <Text>Reporter:</Text>
              <User accountId={details.reporterAccountId} />
            </Inline>
            <Inline space="space.100" alignBlock="baseline">
              <Text>Updated:</Text>
              <Text>{formatRelativeTime(details.updated)}</Text>
            </Inline>
          </Stack>
        </Box>

        <Box xcss={sectionStyles}>
          <Stack space="space.100">
            <Heading as="h3" size="small">Linked Issues ({details.linkedIssues.length})</Heading>
            <LinkedIssuesTable issues={details.linkedIssues} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
