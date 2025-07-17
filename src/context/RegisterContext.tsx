import React, { createContext, useContext, useEffect, useState } from "react";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type EntryType = "issues";

export interface Entry {
    id?: string;
    type: EntryType;
    title: string;
    description: string;
    dueDate: string;
    dateIdentified: string;
    reportedBy: string;
    category: string;
    probability: string;
    impact: string;
    priority: string;
    owner: string;
    responseStrategy: string;
    actionPlan: string;
    plannedCompletionDate: string;
    status: string;
    changeLog: string;
    comments: string;
    linkedProjectTask: string;
    relatedRiskId?: string;
    images?: string[]; // <-- update this line
  }
  

interface RegisterContextType {
  entries: Entry[];
  addOrUpdateEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

const STORAGE_KEY = "@issue_register_entries";

export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  // Load entries on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setEntries(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load entries from storage", error);
      }
    })();
  }, []);

  // Save entries to storage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries)).catch((err) =>
      console.error("Failed to save entries", err)
    );
  }, [entries]);

  const addOrUpdateEntry = (entry: Entry) => {
    if (entry.id) {
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, ...entry } : e))
      );
    } else {
      const newEntry: Entry = {
        ...entry,
        id: uuid.v4() as string,
      };
      setEntries((prev) => [...prev, newEntry]);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <RegisterContext.Provider value={{ entries, addOrUpdateEntry, deleteEntry }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegister must be used within a RegisterProvider");
  }
  return context;
};
