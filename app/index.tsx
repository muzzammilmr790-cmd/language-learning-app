import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import React from "react";
import { useLanguageStore } from "../store/useLanguageStore";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { getSelectedLanguage } = useLanguageStore();
  const selectedLanguage = getSelectedLanguage();

  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (useLanguageStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useLanguageStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      return () => unsub();
    }
  }, []);

  if (!isLoaded || !hydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguage) {
    return <Redirect href="/language-selection" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
