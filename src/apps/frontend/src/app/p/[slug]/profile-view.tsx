"use client";

import { Card, Text, Heading, Grid, Box, Flex, Avatar } from "@radix-ui/themes";
import Link from "next/link";
import { Briefcase, XCircle, FileText, ArrowUpRight } from "lucide-react";

import type { PublicProfile } from "@/types";
import { BadgesDisplay } from "@/app/profile/components/badges-display";

export default function ProfileView({ profile }: { profile: PublicProfile }) {
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col items-center gap-4 border-b border-border pb-8 text-center sm:flex-row sm:text-left">
          <Avatar
            fallback={profile.name?.[0]?.toUpperCase() || "U"}
            size="8"
            radius="full"
            color="indigo"
            variant="soft"
          />
          <div>
            <Heading size="8" className="text-foreground">
              {profile.name}
            </Heading>
            <Text size="3" color="gray">
              Kullanıcı Profili ve İstatistikleri
            </Text>
          </div>
        </div>

        {profile.bio && (
          <Box className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <Heading size="4" mb="3" className="text-foreground">
              Hakkında
            </Heading>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {profile.bio.split(/(\s+)/).map((part: string, _i: number) => {
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                if (part.match(urlRegex)) {
                  return (
                    <a
                      key={part}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline break-all"
                    >
                      {part}
                    </a>
                  );
                }
                return part;
              })}
            </div>
          </Box>
        )}

        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          {profile.stats.totalApplications !== undefined && (
            <Card
              size="3"
              className="shadow-sm transition-shadow hover:shadow-md"
            >
              <Flex gap="4" align="center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Briefcase size={28} />
                </div>
                <Box>
                  <Text as="div" size="2" weight="medium" color="gray">
                    Toplam Başvuru
                  </Text>
                  <Text
                    as="div"
                    size="7"
                    weight="bold"
                    className="text-foreground"
                  >
                    {profile.stats.totalApplications}
                  </Text>
                </Box>
              </Flex>
            </Card>
          )}

          {profile.stats.totalRejections !== undefined && (
            <Card
              size="3"
              className="shadow-sm transition-shadow hover:shadow-md"
            >
              <Flex gap="4" align="center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <XCircle size={28} />
                </div>
                <Box>
                  <Text as="div" size="2" weight="medium" color="gray">
                    Alınan Ret
                  </Text>
                  <Text
                    as="div"
                    size="7"
                    weight="bold"
                    className="text-foreground"
                  >
                    {profile.stats.totalRejections}
                  </Text>
                </Box>
              </Flex>
            </Card>
          )}
        </Grid>

        {(profile.latestApplication || profile.latestRejection) && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Heading size="5" className="text-foreground">
                Son Aktiviteler
              </Heading>
              <div className="h-px flex-1 bg-border"></div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {profile.latestApplication && (
                <Link
                  data-umami-event="public_profile_latest_application_open_job_click"
                  href={`/jobs/${profile.latestApplication.jobSlug || profile.latestApplication.jobId}`}
                  className="group h-full"
                >
                  <Card
                    size="2"
                    className="h-full transition-all duration-300 hover:border-indigo-300 hover:shadow-md"
                  >
                    <Flex
                      gap="3"
                      align="start"
                      direction="column"
                      className="h-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <FileText size={18} />
                          <Text size="2" weight="bold">
                            Son Başvuru
                          </Text>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="text-gray-300 transition-colors group-hover:text-indigo-600"
                        />
                      </div>

                      <Box className="flex-1">
                        <Heading
                          size="4"
                          mb="1"
                          className="text-foreground group-hover:text-indigo-600 transition-colors"
                        >
                          {profile.latestApplication.jobTitle}
                        </Heading>
                        <Text size="2" color="gray">
                          {new Date(
                            profile.latestApplication.appliedAt,
                          ).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Link>
              )}

              {profile.latestRejection && (
                <Link
                  data-umami-event="public_profile_latest_rejection_open_job_click"
                  href={`/jobs/${profile.latestRejection.jobSlug || profile.latestRejection.jobId}`}
                  className="group h-full"
                >
                  <Card
                    size="2"
                    className="h-full transition-all duration-300 hover:border-red-300 hover:shadow-md"
                  >
                    <Flex
                      gap="3"
                      align="start"
                      direction="column"
                      className="h-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle size={18} />
                          <Text size="2" weight="bold">
                            Son Ret Yanıtı
                          </Text>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="text-gray-300 transition-colors group-hover:text-red-600"
                        />
                      </div>

                      <Box className="flex-1">
                        <Heading
                          size="4"
                          mb="1"
                          className="text-foreground group-hover:text-red-600 transition-colors"
                        >
                          {profile.latestRejection.jobTitle}
                        </Heading>
                        <Text size="2" color="gray" mb="3" as="div">
                          {new Date(
                            profile.latestRejection.date,
                          ).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                        {profile.latestRejection.feedback && (
                          <div className="rounded-lg bg-red-50 p-3 italic text-red-700">
                            "{profile.latestRejection.feedback}"
                          </div>
                        )}
                      </Box>
                    </Flex>
                  </Card>
                </Link>
              )}
            </div>
          </div>
        )}

        {profile.badges && profile.badges.length > 0 && (
          <BadgesDisplay badges={profile.badges} />
        )}

        {profile.jobs && profile.jobs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Heading size="5" className="text-foreground">
                Yayınlanan İlanlar
              </Heading>
              <div className="h-px flex-1 bg-border"></div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {profile.jobs.map((job) => (
                <Link
                  data-umami-event="public_profile_published_job_open_detail_click"
                  key={job.id}
                  href={`/jobs/${job.slug || job.id}`}
                  className="group"
                >
                  <Card
                    size="2"
                    className="h-full transition-all duration-300 hover:border-indigo-300 hover:shadow-md"
                  >
                    <Flex
                      gap="3"
                      align="start"
                      direction="column"
                      className="h-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Briefcase size={18} />
                          <Text size="2" weight="bold">
                            Aktif İlan
                          </Text>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="text-gray-300 transition-colors group-hover:text-indigo-600"
                        />
                      </div>

                      <Box className="flex-1">
                        <Heading
                          size="4"
                          mb="1"
                          className="text-foreground group-hover:text-indigo-600 transition-colors"
                        >
                          {job.title}
                        </Heading>
                        <Text size="2" color="gray" as="div" mb="1">
                          {job.company} • {job.location}
                        </Text>
                        <Text size="1" color="gray">
                          {new Date(job.createdAt).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          tarihinde yayınlandı
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
