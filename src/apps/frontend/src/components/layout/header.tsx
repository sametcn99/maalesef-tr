"use client";

import { Button, DropdownMenu, Skeleton } from "@radix-ui/themes";
import { Bell, LogIn, LogOut, Menu, User, X, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useNotifications } from "@/hooks";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";

const navItems = [{ label: "İlanlar", href: "/jobs", requiresAuth: false }];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const { unreadCount } = useNotifications();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const visibleNavItems = navItems.filter(
    (item) => !item.requiresAuth || isAuthenticated,
  );

  return (
    <header className="glass sticky top-0 z-40 border-b border-border backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            data-umami-event="header_mobile_menu_toggle_click"
            type="button"
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground sm:hidden"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link
            data-umami-event="layout_header_go_home_click"
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent">
              maalesef.
            </span>
          </Link>
        </div>

        <nav className="hidden gap-1 sm:flex">
          {visibleNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                data-umami-event="header_nav_jobs_click"
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent-muted text-accent"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton width="100px" height="36px" className="rounded-lg" />
          ) : (
            <>
              {isAuthenticated && (
                <Link
                  data-umami-event="layout_header_go_profile_tab_notifications_click"
                  href="/profile?tab=notifications"
                  className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:bg-surface-hover ${
                    unreadCount > 0
                      ? "text-red-500"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span
                    className={`absolute right-2 top-2 h-2 w-2 rounded-full border border-background transition-opacity ${
                      unreadCount > 0 ? "bg-red-500" : "opacity-0"
                    }`}
                  />
                  <Bell size={20} strokeWidth={unreadCount > 0 ? 2.5 : 1.8} />
                </Link>
              )}

              {isAuthenticated ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button
                      data-umami-event="header_user_menu_open_click"
                      size="2"
                      variant="soft"
                      className="h-9 cursor-pointer bg-surface-hover font-medium text-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <User size={16} />
                        <span className="hidden sm:inline">{user?.name}</span>
                      </span>
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    variant="soft"
                    align="end"
                    className="min-w-[160px]"
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        data-umami-event="header_user_menu_profile_click"
                        href="/profile"
                        className="flex w-full items-center gap-2.5"
                      >
                        <User size={16} />
                        Profilim
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        data-umami-event="layout_header_go_jobs_new_click"
                        href="/jobs/new"
                        className="flex w-full items-center gap-2.5"
                      >
                        <Plus size={16} />
                        İlan Yayınla
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                      color="red"
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <LogOut size={16} />
                        Çıkış Yap
                      </span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              ) : (
                <Button
                  data-umami-event="layout_header_go_login_click"
                  size="2"
                  asChild
                  className="h-9 font-medium"
                >
                  <Link
                    data-umami-event="layout_header_go_login_click_2"
                    href="/login"
                    className="inline-flex items-center gap-1"
                  >
                    <LogIn size={14} />
                    Giriş Yap
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Backdrop overlay for mobile menu dismissal */}
          <div
            className="fixed inset-0 z-30 bg-black/30"
            role="presentation"
            onClick={() => setIsMenuOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsMenuOpen(false);
            }}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-[85%] max-w-xs overflow-y-auto border-r border-border bg-background px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-muted">
                Menü
              </span>
              <button
                data-umami-event="header_mobile_menu_close_click"
                type="button"
                aria-label="Menüyü kapat"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-hover"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    data-umami-event="header_mobile_nav_jobs_click"
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-accent-muted text-accent"
                        : "text-foreground hover:bg-surface-hover"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      data-umami-event="header_mobile_profile_click"
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-surface-hover"
                    >
                      <User size={18} />
                      Profilim
                    </Link>
                    <Link
                      data-umami-event="layout_header_go_jobs_new_click_2"
                      href="/jobs/new"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-surface-hover"
                    >
                      <Plus size={18} />
                      İlan Yayınla
                    </Link>
                    <button
                      data-umami-event="layout_header_logout_click"
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium text-red-500 transition-colors hover:bg-surface-hover"
                    >
                      <LogOut size={18} />
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <Link
                    data-umami-event="layout_header_go_login_click_3"
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full rounded-lg px-4 py-3 text-base font-medium text-accent transition-colors hover:bg-accent-muted"
                  >
                    Giriş Yap
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
