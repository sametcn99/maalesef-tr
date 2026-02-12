import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { ApplicationsService } from '../applications/applications.service.js';
import { JobsService } from '../jobs/jobs.service.js';
import { BadgesService } from '../badges/badges.service.js';
import * as crypto from 'crypto';

export interface VisibilitySettings {
  showApplications: boolean;
  showRejections: boolean;
  showRecentActivity: boolean;
  showJobs: boolean;
  showBio: boolean;
  showBadges: boolean;
}

export interface PublicProfile {
  name: string;
  bio: string | null;
  stats: {
    totalApplications: number;
    totalRejections: number;
  };
  latestApplication: {
    jobTitle: string;
    jobSlug: string | null;
    appliedAt: Date;
  } | null;
  latestRejection: {
    jobTitle: string;
    jobSlug: string | null;
    feedback: string | null;
    date: Date;
  } | null;
  jobs: Array<{
    id: string;
    slug: string | null;
    title: string;
    company: string;
    location: string;
    createdAt: Date;
  }>;
  badges: Array<{
    name: string;
    type: string;
    earnedAt: Date;
  }>;
}

@Injectable()
export class ProfilesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly applicationsService: ApplicationsService,
    private readonly jobsService: JobsService,
    private readonly badgesService: BadgesService,
  ) {}

  generateSlug(): string {
    return crypto.randomBytes(6).toString('hex');
  }

  async getMySettings(userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      slug: user.slug,
      bio: user.bio,
      visibilitySettings: user.visibilitySettings,
    };
  }

  async updateSettings(
    userId: string,
    settings: {
      bio?: string | null;
      visibilitySettings?: Partial<VisibilitySettings>;
    },
  ) {
    if (settings.visibilitySettings) {
      await this.usersService.updateVisibilitySettings(
        userId,
        settings.visibilitySettings,
      );
    }
    if (settings.bio !== undefined) {
      await this.usersService.updateBio(userId, settings.bio);
    }
    return this.getMySettings(userId);
  }

  async enableSharing(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user.slug) {
      const slug = this.generateSlug();
      await this.usersService.updateSlug(userId, slug);
    }
    return this.getMySettings(userId);
  }

  async disableSharing(userId: string) {
    await this.usersService.updateSlug(userId, null);
    return this.getMySettings(userId);
  }

  async getPublicProfile(slug: string): Promise<PublicProfile | null> {
    const user = await this.usersService.findBySlug(slug);
    if (!user) return null;
    const settings = user.visibilitySettings as VisibilitySettings;

    const stats = await this.applicationsService.getUserStats(user.id);

    const profile: PublicProfile = {
      name: user.name,
      bio: settings.showBio ? user.bio : null,
      stats: {
        totalApplications: 0,
        totalRejections: 0,
      },
      latestApplication: null,
      latestRejection: null,
      jobs: [],
      badges: [],
    };

    if (settings.showApplications) {
      profile.stats.totalApplications = stats.total;
    }

    if (settings.showRejections) {
      profile.stats.totalRejections = stats.rejected;
    }

    if (settings.showRecentActivity) {
      if (settings.showApplications && stats.latest) {
        profile.latestApplication = {
          jobTitle: stats.latest.jobTitle,
          jobSlug: stats.latest.jobSlug,
          appliedAt: stats.latest.appliedAt,
        };
      }
      if (settings.showRejections && stats.latestRejected) {
        profile.latestRejection = {
          jobTitle: stats.latestRejected.jobTitle,
          jobSlug: stats.latestRejected.jobSlug,
          feedback: stats.latestRejected.feedback,
          date:
            stats.latestRejected.updatedAt || stats.latestRejected.appliedAt, // Fallback if updatedAt is null
        };
      }
    }

    if (settings.showJobs) {
      const jobs = await this.jobsService.findMine(user.id);
      profile.jobs = jobs.map((job) => ({
        id: job.id,
        slug: job.slug,
        title: job.title,
        company: job.company,
        location: job.location,
        createdAt: job.createdAt,
      }));
    }

    if (settings.showBadges) {
      const userBadges = await this.badgesService.findByUserId(user.id);
      profile.badges = userBadges.map((badge) => ({
        name: badge.badgeName,
        type: badge.type,
        earnedAt: badge.createdAt,
      }));
    }

    return profile;
  }
}
