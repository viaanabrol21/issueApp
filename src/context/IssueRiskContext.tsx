import React, { createContext, useContext, useState, ReactNode } from "react";

type Entry = {
  title: string;
  description: string;
  dueDate: string;
  type: "issues" | "risks";
};

type ContextType = {
  entries: Entry[];
  addEntry: (entry: Entry) => void;
};

const IssueRiskContext = createContext<ContextType | undefined>(undefined);

export const IssueRiskProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const addEntry = (entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  };

  return (
    <IssueRiskContext.Provider value={{ entries, addEntry }}>
      {children}
    </IssueRiskContext.Provider>
  );
};

export const useIssueRisk = () => {
  const context = useContext(IssueRiskContext);
  if (!context) {
    throw new Error("useIssueRisk must be used within a IssueRiskProvider");
  }
  return context;
};
