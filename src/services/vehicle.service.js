export function getVehicleTypes() {
  return fetch(
    "https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablevalueslist/vehicle%20type?format=json"
  );
}

export function getVehicleMakes(vehicleType) {
  //Can use pagination here
  return fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${vehicleType}?format=json`
  );
}

export async function getModels(vehicleType, makes, modelyear = "") {
  if (modelyear) {
    modelyear = `modelyear/${modelyear}/`;
  } else {
    modelyear = "";
  }

  const promiseArray = await makes.map((make) => {
    return fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${make.MakeId}/${modelyear}vehicleType/${vehicleType}?format=json`
    ).then((res) => res.json());
  });

  const results = await Promise.all(promiseArray);
  const flat = results.map((result) => result.Results).flat();
  return flat;
}
