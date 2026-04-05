"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, Badge } from "@radix-ui/themes";
import { FileText, Bell, Briefcase } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
  useApplications,
  useNotifications,
  useMyJobs,
  useBadges,
} from "@/hooks";
import { useAuth } from "@/context/auth-context";
import { FeedbackModal } from "@/components/application";
import { useProfileSettingsStore } from "@/stores/profile-settings-store";
import { useProfileUiStore } from "@/stores/profile-ui-store";

import { ProfileHeader } from "./components/profile-header";
import { SettingsDialog } from "./components/settings-dialog";
import { ProfileSharing } from "./components/profile-sharing";
import { StatsSummary } from "./components/stats-summary";
import { ApplicationsTab } from "./components/applications-tab";
import { NotificationsTab } from "./components/notifications-tab";
import { MyJobsTab } from "./components/my-jobs-tab";
import { BadgesDisplay } from "./components/badges-display";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const resetProfileSettings = useProfileSettingsStore((state) => state.reset);
  const {
    selectedApplication,
    isFeedbackModalOpen,
    accountDeleted,
    openFeedbackModal,
    closeFeedbackModal,
    setAccountDeleted,
    resetAll,
  } = useProfileUiStore(
    useShallow((state) => ({
      selectedApplication: state.selectedApplication,
      isFeedbackModalOpen: state.isFeedbackModalOpen,
      accountDeleted: state.accountDeleted,
      openFeedbackModal: state.openFeedbackModal,
      closeFeedbackModal: state.closeFeedbackModal,
      setAccountDeleted: state.setAccountDeleted,
      resetAll: state.resetAll,
    })),
  );

  const defaultTab =
    searchParams.get("tab") === "notifications"
      ? "notifications"
      : searchParams.get("tab") === "jobs"
        ? "jobs"
        : "applications";

  const {
    applications,
    loading: appsLoading,
    error: appsError,
  } = useApplications();
  const {
    notifications,
    loading: notifsLoading,
    error: notifsError,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const {
    jobs: myJobs,
    loading: myJobsLoading,
    error: myJobsError,
    removeJob,
  } = useMyJobs();

  const { badges, loading: badgesLoading, error: badgesError } = useBadges();

  useEffect(() => {
    setAccountDeleted(false);

    return () => {
      resetAll();
      resetProfileSettings();
    };
  }, [resetAll, resetProfileSettings, setAccountDeleted]);

  // Redirect to login if not authenticated (wait for auth to finish loading)
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !accountDeleted) {
      router.replace("/login?redirect=/profile");
    }
  }, [isAuthenticated, authLoading, router, accountDeleted]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 min-h-screen">
      {/* Profile header */}
      <div className="animate-fade-in mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <ProfileHeader user={user} />
          <SettingsDialog user={user} />
        </div>

        {/* Profile Sharing - Moved out of SettingsDialog */}
        <div className="mt-6">
          <ProfileSharing />
        </div>

        {/* Stats */}
        <StatsSummary applications={applications} loading={appsLoading} />

        {/* Badges */}
        {!badgesLoading && !badgesError && badges.length > 0 && (
          <div className="mt-6">
            <BadgesDisplay badges={badges} />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <Tabs.Root defaultValue={defaultTab} className="w-full">
          <Tabs.List className="mb-0 flex gap-8 border-b border-border px-0">
            <Tabs.Trigger
              value="applications"
              className="pb-3 text-sm font-medium text-muted data-[state=active]:text-accent data-[state=active]:shadow-[0_-2px_0_0_theme(colors.accent)]"
            >
              <span className="inline-flex items-center gap-2">
                <FileText size={15} />
                Başvurularım
                {applications.length > 0 && (
                  <Badge size="1" variant="soft" className="h-5 text-[10px]">
                    {applications.length}
                  </Badge>
                )}
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="jobs"
              className="pb-3 text-sm font-medium text-muted data-[state=active]:text-accent data-[state=active]:shadow-[0_-2px_0_0_theme(colors.accent)]"
            >
              <span className="inline-flex items-center gap-2">
                <Briefcase size={15} />
                Yayınladığım İlanlar
                {myJobs.length > 0 && (
                  <Badge size="1" variant="soft" className="h-5 text-[10px]">
                    {myJobs.length}
                  </Badge>
                )}
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="notifications"
              className="pb-3 text-sm font-medium text-muted data-[state=active]:text-accent data-[state=active]:shadow-[0_-2px_0_0_theme(colors.accent)]"
            >
              <span className="inline-flex items-center gap-2">
                <Bell size={15} />
                Bildirimler
                {unreadCount > 0 && (
                  <Badge
                    size="1"
                    variant="solid"
                    color="red"
                    className="h-5 min-w-5 text-[10px]"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </span>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="applications" className="pt-8">
            <ApplicationsTab
              applications={applications}
              loading={appsLoading}
              error={appsError}
              onRowClick={openFeedbackModal}
            />
          </Tabs.Content>

          <Tabs.Content value="notifications" className="pt-8">
            <NotificationsTab
              notifications={notifications}
              loading={notifsLoading}
              error={notifsError}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
            />
          </Tabs.Content>

          <Tabs.Content value="jobs" className="pt-8">
            <MyJobsTab
              jobs={myJobs}
              loading={myJobsLoading}
              error={myJobsError}
              removeJob={removeJob}
            />
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <FeedbackModal
        application={selectedApplication}
        isOpen={isFeedbackModalOpen}
        onClose={closeFeedbackModal}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}
