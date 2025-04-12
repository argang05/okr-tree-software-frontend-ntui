"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { initializeTeamsContext, getTeamsContext, isRunningInTeams, setTeamsTheme } from "@/lib/teams-client";

const TeamsContext = createContext();

export function TeamsProvider({ children }) {
  const [isTeams, setIsTeams] = useState(false);
  const [teamsContext, setTeamsContext] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initTeams = async () => {
      try {
        setIsInitializing(true);
        
        // Initialize Teams SDK with a flag to check if it's running in Teams
        const isInitialized = initializeTeamsContext();
        setInitialized(isInitialized);

        // Only proceed if initialization was successful
        if (isInitialized) {
          // Check if running in Teams
          const runningInTeams = isRunningInTeams();
          setIsTeams(runningInTeams);

          // If running in Teams, get context
          if (runningInTeams) {
            const context = await getTeamsContext();
            if (context) {
              setTeamsContext(context);
              
              // Set Teams theme
              setTeamsTheme();
            }
          }
        } else {
          // Not running in Teams environment
          setIsTeams(false);
        }
      } catch (error) {
        console.error("Failed to initialize Teams:", error);
        setIsTeams(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initTeams().catch(err => {
      console.error("Unhandled Teams initialization error:", err);
      setIsInitializing(false);
      setIsTeams(false);
    });
  }, []);

  return (
    <TeamsContext.Provider
      value={{
        isTeams,
        teamsContext,
        initialized,
        isInitializing
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
}

export const useTeams = () => useContext(TeamsContext); 