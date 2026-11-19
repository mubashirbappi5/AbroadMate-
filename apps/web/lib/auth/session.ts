import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma, AppRole, User } from "@abroadmate/database";

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
 * Derives authenticated user strictly from server-verified Supabase session.
 * Never trusts client-supplied user IDs.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUserSession | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !supabaseUser || !supabaseUser.email) {
      return null;
    }

    // Look up or link user record in PostgreSQL via Prisma
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
      include: {
        roles: true,
      },
    });

    // If user exists in Supabase Auth but not yet in PostgreSQL (e.g. freshly verified OAuth/Email),
    // automatically provision the base record in PostgreSQL
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

    if (!dbUser.isActive || dbUser.deletedAt) {
      return null;
    }

    return {
      user: dbUser,
      supabaseUser: {
        id: supabaseUser.id,
        email: supabaseUser.email,
      },
    };
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
