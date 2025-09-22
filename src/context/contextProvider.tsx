"use client"
import moment from "moment";
import React, { createContext, useState, useContext } from "react";

interface GlobalContextType {
    selectedBranch: string;
    setSelectedBranch: React.Dispatch<React.SetStateAction<string>>;
    dateRange: string;
    setDateRange: React.Dispatch<React.SetStateAction<string>>;
    startDate: Date;
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
    endDate: Date;
    setEndDate: React.Dispatch<React.SetStateAction<Date>>;
}

const GlobalContext = createContext<GlobalContextType>({
    selectedBranch: "All",
    setSelectedBranch: () => { },
    dateRange: "Today",
    setDateRange: () => { },
    startDate: new Date(),
    setStartDate: () => { },
    endDate: new Date(),
    setEndDate: () => { },
});

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedBranch, setSelectedBranch] = useState("All");
    const [dateRange, setDateRange] = useState("Today");
    const [startDate, setStartDate] = useState(moment().startOf("day").toDate());
    const [endDate, setEndDate] = useState(moment().endOf("day").toDate());

    return (
        <GlobalContext.Provider
            value={{
                selectedBranch,
                setSelectedBranch,
                dateRange,
                setDateRange,
                startDate,
                setStartDate,
                endDate,
                setEndDate,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
