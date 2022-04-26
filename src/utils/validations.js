export function validateVehicleForm(vehicleType, makes, useYear, isYearValid) {
  return vehicleType &&
    makes.length > 0 &&
    ((useYear && isYearValid) || !useYear)
    ? 1
    : 0;
}
