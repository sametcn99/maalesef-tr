"use client";

import { useProfileSettings } from "@/hooks/use-profile-settings";
import {
  Button,
  Checkbox,
  Switch,
  Flex,
  TextArea,
  Box,
  Text,
} from "@radix-ui/themes";
import {
  Copy,
  Share2,
  Save,
  ChevronDown,
  ChevronUp,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { VisibilitySettings } from "@/lib/api";

export function ProfileSharing() {
  const {
    settings,
    loading: settingsLoading,
    toggleSharing,
    updateProfile,
  } = useProfileSettings(true);

  const [localVisibility, setLocalVisibility] =
    useState<VisibilitySettings | null>(null);
  const [localBio, setLocalBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (settings) {
      if (settings.visibilitySettings) {
        setLocalVisibility(settings.visibilitySettings);
      }
      setLocalBio(settings.bio || "");
    }
  }, [settings]);

  const hasChanges =
    (localVisibility &&
      settings &&
      JSON.stringify(localVisibility) !==
        JSON.stringify(settings.visibilitySettings)) ||
    (settings && localBio !== (settings.bio || ""));

  const handleCheckChange = (key: keyof VisibilitySettings, value: boolean) => {
    setLocalVisibility((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSave = async () => {
    if (!localVisibility) return;
    setSaving(true);
    try {
      await updateProfile({
        bio: localBio,
        visibilitySettings: localVisibility,
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleCollapse = () => {
    if (settings?.slug) setIsCollapsed(!isCollapsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCollapse();
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Share2 size={18} />
        </span>
        <button
          data-umami-event="profile_sharing_toggle_panel_click"
          type="button"
          className="flex-1 cursor-pointer text-left bg-transparent border-none p-0 appearance-none outline-none"
          onClick={toggleCollapse}
          onKeyDown={handleKeyDown}
          tabIndex={settings?.slug ? 0 : -1}
          aria-expanded={!isCollapsed}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Profil Paylaşımı
            </h2>
            {settings?.slug && (
              <span className="text-gray-300 transition-transform duration-300">
                {isCollapsed ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
              </span>
            )}
          </div>
          <p className="text-xs text-muted">
            Profilini paylaş, hakkında yazısı ekle ve istatistiklerini göster.
          </p>
        </button>
        <div className="ml-auto">
          {/* @ts-ignore */}
          <Switch
            checked={!!settings?.slug}
            onCheckedChange={(val) => {
              toggleSharing(val);
              if (val) setIsCollapsed(false);
            }}
            disabled={settingsLoading || !settings}
            size="1"
          />
        </div>
      </div>

      {settings?.slug && localVisibility && !isCollapsed && (
        <div className="animate-fade-in mt-4 space-y-5 border-t border-border pt-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-hover p-2">
            <code className="text-muted flex-1 break-all text-xs">
              {typeof window !== "undefined"
                ? `${window.location.origin}/p/${settings.slug}`
                : `.../p/${settings.slug}`}
            </code>
            <Button
              data-umami-event="profile_sharing_copy_public_link_click"
              variant="ghost"
              size="1"
              onClick={() => {
                if (settings?.slug) {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/p/${settings.slug}`,
                  );
                }
              }}
            >
              <Copy size={14} />
            </Button>
          </div>

          <Box className="space-y-2">
            <Flex align="center" gap="2" className="text-foreground">
              <UserCircle size={16} className="text-indigo-500" />
              <Text size="2" weight="bold">
                Hakkımda
              </Text>
            </Flex>
            <TextArea
              placeholder="Kendinden bahset, deneyimlerini yaz veya sosyal medya linklerini ekle..."
              value={localBio}
              onChange={(e) => setLocalBio(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <Text size="1" color="gray">
              Yazdığın linkler otomatik olarak tıklanabilir olacaktır.
            </Text>
          </Box>

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className="flex items-center gap-2 cursor-pointer"
                htmlFor="showBio"
              >
                <Checkbox
                  id="showBio"
                  checked={localVisibility.showBio}
                  onCheckedChange={(c) => handleCheckChange("showBio", !!c)}
                />
                <span className="text-xs">Hakkımda yazısını göster</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                htmlFor="showApplications"
              >
                <Checkbox
                  id="showApplications"
                  checked={localVisibility.showApplications}
                  onCheckedChange={(c) =>
                    handleCheckChange("showApplications", !!c)
                  }
                />
                <span className="text-xs">Başvuru sayılarımı göster</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                htmlFor="showRejections"
              >
                <Checkbox
                  id="showRejections"
                  checked={localVisibility.showRejections}
                  onCheckedChange={(c) =>
                    handleCheckChange("showRejections", !!c)
                  }
                />
                <span className="text-xs">Ret sayılarımı göster</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                htmlFor="showRecentActivity"
              >
                <Checkbox
                  id="showRecentActivity"
                  checked={localVisibility.showRecentActivity}
                  onCheckedChange={(c) =>
                    handleCheckChange("showRecentActivity", !!c)
                  }
                />
                <span className="text-xs">Son aktivitelerimi göster</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                htmlFor="showJobs"
              >
                <Checkbox
                  id="showJobs"
                  checked={localVisibility.showJobs}
                  onCheckedChange={(c) => handleCheckChange("showJobs", !!c)}
                />
                <span className="text-xs">Paylaştığım ilanları göster</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                htmlFor="showBadges"
              >
                <Checkbox
                  id="showBadges"
                  checked={localVisibility.showBadges}
                  onCheckedChange={(c) => handleCheckChange("showBadges", !!c)}
                />
                <span className="text-xs">Rozetlerimi göster</span>
              </label>
            </div>

            {hasChanges && (
              <Flex justify="end" className="pt-2 animate-fade-in">
                <Button
                  data-umami-event="profile_profile_sharing_save_click"
                  size="2"
                  onClick={handleSave}
                  loading={saving}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save size={14} />
                  Değişiklikleri Kaydet
                </Button>
              </Flex>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
