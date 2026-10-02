export interface DashboardSummary {
  activeJobs: number;
  newApplications: number;
  shortlistedApplications: number;
  scheduledInterviews: number;
  offersMade: number;
  hiredCandidates: number;
  applicationsByStatus: Record<string, number>;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValuesJson?: string;
  newValuesJson?: string;
  correlationId?: string;
  ipAddress?: string;
  createdAtUtc: string;
}

export interface AuditLogFilterParams {
  entityType?: string;
  action?: string;
  actorUserId?: string;
  fromUtc?: string;
  toUtc?: string;
  page?: number;
  pageSize?: number;
}
