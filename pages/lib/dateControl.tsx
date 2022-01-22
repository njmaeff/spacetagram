import {addYears, eachYearOfInterval, formatISO} from "date-fns";
import React, {useState} from "react";
import {Select} from "@shopify/polaris";

export const getISODate = (date: Date): string => formatISO(date, {representation: 'date'})

export const makeDateInterval = () => {
    const dateInterval = eachYearOfInterval({
        start: new Date(2000, 1, 0),
        end: new Date()
    }).reverse().map((date) => {
        return {
            label: `${date.getFullYear()}`,
            value: `${getISODate(date)}`
        }
    })

    dateInterval.unshift({label: '', value: 'none'})

    return dateInterval;
};

export const dateInterval = makeDateInterval();

export const DateControl: React.FC<{ updateDateRange }> = ({updateDateRange}) => {
    const [selection, updateSelection] = useState("none")

    return <Select
        label="By Year"
        labelInline={true}
        options={dateInterval}
        onChange={(value) => {
            updateSelection(value)
            if (value === 'none') {
                updateDateRange(null)
            } else {
                const start = new Date(value);
                updateDateRange([
                    getISODate(start),
                    getISODate(addYears(start, 1)),
                ]);

            }
        }}
        value={selection}
    />
};
