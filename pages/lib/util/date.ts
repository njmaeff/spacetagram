export const getISODate = (date: Date) => {
    const [isoDate,] = date.toISOString().split('T');
    return isoDate;
}
