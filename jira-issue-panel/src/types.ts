export interface LinkedIssue {
  key: string;
  summary: string;
  status: string;
  linkType: string;
  direction: 'inward' | 'outward';
}

export interface IssueDetails {
  key: string;
  summary: string;
  status: string;
  statusCategory: string;
  priority: string;
  assignee: string | null;
  assigneeAccountId: string | null;
  reporter: string;
  reporterAccountId: string;
  created: string;
  updated: string;
  commentCount: number;
  linkedIssues: LinkedIssue[];
}

export interface GetIssueDetailsPayload {
  issueKey: string;
}

export interface ResolverResponse {
  issueDetails: IssueDetails;
}
