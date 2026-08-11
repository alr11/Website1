import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

interface AuthValue {
  session: Session | null;
  user: User | null;
  /** True until the stored session has been read from AsyncStorage. */
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = React.createContext<AuthValue | null>(null);

export function useAuth() {
  const value = React.useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

/** The signed-in user. Throws inside the signed-out part of the app. */
export function useUser() {
  const { user } = useAuth();
  if (!user) throw new Error("useUser used while signed out");
  return user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      },
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = React.useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,

      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw new Error(error.message);
      },

      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw new Error(error.message);
        // Projects with email confirmation on return a user but no session.
        return { needsConfirmation: !data.session };
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
      },

      sendPasswordReset: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: "everly://reset-password" },
        );
        if (error) throw new Error(error.message);
      },

      /**
       * App Store guideline 5.1.1(v) requires in-app account deletion for any
       * app that lets people create an account. Backed by the
       * `delete_own_account` function in migration 0002.
       */
      deleteAccount: async () => {
        const { error } = await supabase.rpc("delete_own_account");
        if (error) throw new Error(error.message);
        await supabase.auth.signOut();
      },
    }),
    [session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
