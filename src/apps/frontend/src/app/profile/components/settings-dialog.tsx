"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Dialog, Button, TextField } from "@radix-ui/themes";
import {
  Settings,
  LockKeyhole,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  updateSettings: (dto: {
    notificationEmailEnabled?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    old: string,
    newP: string,
  ) => Promise<{ success: boolean; error?: string }>;
  onAccountDeleted: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  user,
  updateSettings,
  deleteAccount,
  changePassword,
  onAccountDeleted,
}: SettingsDialogProps) {
  const router = useRouter();

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);

  // Delete Account State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setChangeError(null);
    setChangeSuccess(null);

    if (newPassword !== confirmPassword) {
      setChangeError("Yeni şifre ve tekrar aynı olmalıdır.");
      return;
    }

    setChangeLoading(true);
    const result = await changePassword(currentPassword, newPassword);

    if (!result.success) {
      setChangeError(result.error ?? "Şifre değiştirilemedi.");
    } else {
      setChangeSuccess("Şifreniz başarıyla güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setChangeLoading(false);
  }

  async function handleDeleteAccount() {
    if (!deletePassword) {
      setDeleteError("Hesabınızı silmek için şifrenizi girmelisiniz.");
      return;
    }

    setDeleteError(null);
    setDeleteLoading(true);
    const result = await deleteAccount(deletePassword);

    if (!result.success) {
      setDeleteError(result.error ?? "Hesap silinirken bir sorun oluştu.");
      setDeleteLoading(false);
      return;
    }

    setDeleteLoading(false);
    setDeleteDialogOpen(false);
    onOpenChange(false);
    onAccountDeleted();
    router.replace("/");
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button
          data-umami-event="profile_settings_open_dialog_click"
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings size={16} />
          Ayarlar
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="max-w-3xl border border-border shadow-2xl">
        <Dialog.Title className="mb-1 text-xl font-semibold text-foreground">
          Profil Ayarları
        </Dialog.Title>
        <p className="mb-5 text-sm text-muted">
          Şifreni güncelle veya hesabını kalıcı olarak silmek için aşağıdaki
          seçenekleri kullan.
        </p>

        {/* Change password */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <LockKeyhole size={18} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Şifreyi Güncelle
              </h2>
              <p className="text-sm text-muted">
                Güvenliğin için mevcut şifreni doğrula ve yeni bir şifre
                belirle.
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="currentPassword"
                >
                  Mevcut şifre
                </label>
                <TextField.Root
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCurrentPassword(e.target.value)
                  }
                  required
                  className="mt-2 w-full"
                />
              </div>

              <div className="sm:col-span-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="newPassword"
                >
                  Yeni şifre
                </label>
                <TextField.Root
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  minLength={6}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewPassword(e.target.value)
                  }
                  required
                  className="mt-2 w-full"
                />
              </div>

              <div className="sm:col-span-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="confirmPassword"
                >
                  Yeni şifre (tekrar)
                </label>
                <TextField.Root
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  className="mt-2 w-full"
                />
              </div>
            </div>

            {changeError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {changeError}
              </div>
            )}

            {changeSuccess && (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm text-green-700">
                <CheckCircle2 size={16} />
                {changeSuccess}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                data-umami-event="profile_settings_dialog_submit_click"
                type="submit"
                disabled={changeLoading}
              >
                {changeLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </Button>
            </div>
          </form>
        </div>

        {/* Notification settings */}
        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <Bell size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  E-posta Bildirimleri
                </h2>
                <p className="text-sm text-muted">
                  Okunmamış bildirimlerini iki günde bir özet mail olarak al.
                </p>
              </div>
            </div>

            <Button
              data-umami-event="profile_settings_toggle_email_notifications_click"
              variant={user?.notificationEmailEnabled ? "solid" : "outline"}
              color={user?.notificationEmailEnabled ? "orange" : "gray"}
              onClick={() =>
                updateSettings({
                  notificationEmailEnabled: !user?.notificationEmailEnabled,
                })
              }
            >
              {user?.notificationEmailEnabled ? "Açık" : "Kapalı"}
            </Button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="mt-6 rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-amber-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-700">
                <AlertTriangle size={14} />
                Hesap Silme
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Hesabınızı kalıcı olarak silin
              </h2>
              <p className="max-w-2xl text-sm text-muted">
                Onayladığınızda hesabınız, oluşturduğunuz ilanlar ve tüm
                başvurularınız geri getirilemeyecek şekilde silinir. Bu işlem
                geri alınamaz.
              </p>
            </div>

            <Dialog.Root
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <Dialog.Trigger>
                <Button
                  data-umami-event="profile_settings_dialog_delete_click"
                  color="red"
                  variant="solid"
                  size="3"
                  className="font-semibold"
                >
                  <Trash2 size={16} />
                  Hesabımı Sil
                </Button>
              </Dialog.Trigger>

              <Dialog.Content className="max-w-lg border border-border shadow-xl">
                <Dialog.Title className="mb-2 flex items-center gap-3 text-lg font-semibold text-foreground">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
                    <AlertTriangle size={20} />
                  </span>
                  Hesabı silmek üzeresiniz
                </Dialog.Title>
                <p className="text-sm text-muted">
                  Devam ederseniz hesabınız, oluşturduğunuz tüm ilanlar, bu
                  ilanlara gelen başvurular ve kendi başvurularınız kalıcı
                  olarak silinir. İşlem tamamlandığında tekrar giriş
                  yapamazsınız.
                </p>

                <div className="mt-4 space-y-2">
                  <label
                    className="text-sm font-medium text-foreground"
                    htmlFor="deletePassword"
                  >
                    Onaylamak için şifrenizi girin
                  </label>
                  <TextField.Root
                    id="deletePassword"
                    type="password"
                    placeholder="Şifreniz"
                    value={deletePassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setDeletePassword(e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                {deleteError && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {deleteError}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Dialog.Close>
                    <Button
                      data-umami-event="profile_settings_delete_cancel_click"
                      variant="ghost"
                      color="gray"
                      disabled={deleteLoading}
                    >
                      Vazgeç
                    </Button>
                  </Dialog.Close>
                  <Button
                    data-umami-event="profile_settings_dialog_delete_click_2"
                    color="red"
                    variant="solid"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Siliniyor..." : "Evet, hesabımı sil"}
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
