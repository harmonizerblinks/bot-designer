export const validateMeterNumber = (text: string): boolean => {
  const meterNumber = parseInt(text, 10);
  return !isNaN(meterNumber) && meterNumber.toString().length === 11;
};