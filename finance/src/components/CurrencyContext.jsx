
import React, { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {

    const [currency, setCurrency] = useState(
        localStorage.getItem("currency") || "FCFA"
    );

    useEffect(() => {

        localStorage.setItem("currency", currency);

    }, [currency]);


    const formatAmount = (amount) => {

        return `${currency} ${Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    };


    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                formatAmount
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}


export function useCurrency() {

    return useContext(CurrencyContext);

}

