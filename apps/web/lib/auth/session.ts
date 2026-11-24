import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma, AppRole, User } from "@abroadmate/database";
import { verifySessionToken } from "./password";

export const SESSION_COOKIE_NAME = "abroadmate_session";

export interface AuthenticatedUserSession {
  user: User & {
    roles: Array<{ role: AppRole }>;
  };
  supabaseUser: {
    id: string;
    email?: string;
  };
}

/**
 * Derives authenticated user strictly from server-verified session cookie or Supabase session.
 * Never trusts client-supplied user IDs.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUserSession | null> {
  try {
    // 1. Check direct PostgreSQL secure session cookie first
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

      if (sessionCookie) {
        const payload = verifySessionToken(sessionCookie);
        if (payload?.userId) {
          const dbUser = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
              roles: true,
            },
          });

          if (dbUser && dbUser.isActive && !dbUser.deletedAt) {
            return {
              user: dbUser,
              supabaseUser: {
                id: dbUser.supabaseId || dbUser.id,
                email: dbUser.email,
              },
            };
          }
        }
      }
    } catch (cookieErr) {
      // If called outside request context or cookie failure, fall through to Supabase
    }

    // 2. Check Supabase Auth session as fallback / dual-mode
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user: supabaseUser },
        error,
      } = await supabase.auth.getUser();

      if (!error && supabaseUser && supabaseUser.email) {
        // Look up or link user record in PostgreSQL via Prisma
        let dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { supabaseId: supabaseUser.id },
              { email: supabaseUser.email },
            ],
          },
          include: {
            roles: true,
          },
        });

        // Auto-provision in PostgreSQL if needed
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              supabaseId: supabaseUser.id,
              email: supabaseUser.email,
              fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email.split("@")[0],
              phone: supabaseUser.user_metadata?.phone || null,
              primaryRole: AppRole.STUDENT,
              roles: {
                create: {
                  role: AppRole.STUDENT,
                },
              },
              settings: {
                create: {
                  preferredLang: "BN",
                  currencyPreference: "BDT",
                },
              },
            },
            include: {
              roles: true,
            },
          });
        }

        if (dbUser && dbUser.isActive && !dbUser.deletedAt) {
          return {
            user: dbUser,
            supabaseUser: {
              id: supabaseUser.id,
              email: supabaseUser.email,
            },
          };
        }
      }
    } catch {
      // Supabase unavailable or mock
    }

    return null;
  } catch (err) {
    console.error("Error verifying authenticated session:", err);
    return null;
  }
}

/**
 * Enforces authenticated session. Throws error if unauthenticated.
 */
export async function requireAuth(): Promise<AuthenticatedUserSession> {
  const session = await getAuthenticatedUser();
  if (!session) {
    throw new Error("UNAUTHORIZED: অনুগ্রহ করে প্রথমে লগইন করুন।");
  }
  return session;
}

/**
 * Enforces Role-Based Access Control (RBAC).
 * Checks primary role and role assignments table.
 */
export async function requireRole(allowedRoles: AppRole[]): Promise<AuthenticatedUserSession> {
  const session = await requireAuth();
  const userRoles = [
    session.user.primaryRole,
    ...session.user.roles.map((r) => r.role),
  ];

  const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasPermission) {
    throw new Error("FORBIDDEN: এই কার্যসম্পাদনের জন্য আপনার পর্যাপ্ত প্রশাসনিক অনুমতি নেই।");
  }

  return session;
}
