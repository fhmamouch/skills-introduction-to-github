import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { IssueDetails, LinkedIssue, ResolverResponse } from './types';

interface ResolverRequest {
  payload: {
    issueKey?: string;
  };
  context: {
    extension: {
      issue: {
        key: string;
      };
    };
  };
}

const resolver = new Resolver();

resolver.define('getIssueDetails', async (req: ResolverRequest): Promise<ResolverResponse> => {
  const issueKey = req.context.extension.issue.key;

  const response = await api.asUser().requestJira(
    route`/rest/api/3/issue/${issueKey}?fields=summary,status,priority,assignee,reporter,created,updated,comment,issuelinks`,
    { headers: { Accept: 'application/json' } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch issue: ${response.status}`);
  }

  const data = await response.json();
  const fields = data.fields;

  const linkedIssues: LinkedIssue[] = (fields.issuelinks || []).map((link: any) => {
    if (link.outwardIssue) {
      return {
        key: link.outwardIssue.key,
        summary: link.outwardIssue.fields.summary,
        status: link.outwardIssue.fields.status.name,
        linkType: link.type.outward,
        direction: 'outward' as const,
      };
    }
    return {
      key: link.inwardIssue.key,
      summary: link.inwardIssue.fields.summary,
      status: link.inwardIssue.fields.status.name,
      linkType: link.type.inward,
      direction: 'inward' as const,
    };
  });

  const issueDetails: IssueDetails = {
    key: issueKey,
    summary: fields.summary,
    status: fields.status.name,
    statusCategory: fields.status.statusCategory.name,
    priority: fields.priority?.name || 'None',
    assignee: fields.assignee?.displayName || null,
    assigneeAccountId: fields.assignee?.accountId || null,
    reporter: fields.reporter?.displayName || 'Unknown',
    reporterAccountId: fields.reporter?.accountId || '',
    created: fields.created,
    updated: fields.updated,
    commentCount: fields.comment?.total || 0,
    linkedIssues,
  };

  return { issueDetails };
});

export const handler = resolver.getDefinitions();
