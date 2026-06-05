import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuth from "./useAuth";

export default function useProfile() {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (authLoading) return;

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error.message);
      }

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [user, authLoading]);

  return { profile, loading };
}
