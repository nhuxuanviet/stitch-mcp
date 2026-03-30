import { GcloudHandler } from '../gcloud/handler.js';

export interface StitchSdkAuthConfig {
  apiKey?: string;
  accessToken?: string;
  projectId?: string;
}

export async function resolveStitchSdkAuth(): Promise<StitchSdkAuthConfig> {
  if (process.env.STITCH_API_KEY) {
    return { apiKey: process.env.STITCH_API_KEY };
  }

  const gcloud = new GcloudHandler();
  const [projectId, gcloudToken] = await Promise.all([
    gcloud.getProjectId(),
    gcloud.getAccessToken(),
  ]);

  const accessToken = process.env.STITCH_ACCESS_TOKEN || gcloudToken || undefined;

  if (accessToken && projectId) {
    return {
      accessToken,
      projectId,
    };
  }

  return {
    accessToken,
    projectId: projectId || undefined,
  };
}
