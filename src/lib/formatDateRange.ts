export function formatDateRange(startDate: Date, endDate: Date): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const sameDay = start.toDateString() === end.toDateString();

    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };

    if (sameDay) {
        return start.toLocaleDateString("en-US", options);
    }

    // If both dates are in the same month and year, show shorter form

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString("en-US", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-US", options)}`;
    }
    return `${start.toLocaleDateString("en-US", options)} – ${end.toLocaleDateString("en-US", options)}`;
}
