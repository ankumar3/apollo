import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import ModelTable from "../model-table";
import {
  getVehicleTypes,
  getVehicleMakes,
  getModels,
} from "../../services/vehicle.service";
import { validateVehicleForm } from "../../utils/validations";
import "./car-search.css";

const CarSearch = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [useYear, setUseYear] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [models, setModels] = useState([]);
  const [isSearch, setIsSearching] = useState(false);
  const [isYearValid, setIsYearValid] = useState(true);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    getVehicleTypes()
      .then((res) => res.json())
      .then((data) => {
        setVehicleTypes(data.Results);
      })
      .catch((err) => console.log(err));
  }, []);

  const vehcileTypeChanged = (e) => {
    const selectedType = e.target.value;

    getVehicleMakes(selectedType)
      .then((res) => res.json())
      .then((data) => {
        setSelectedVehicleType(selectedType);
        setVehicleMakes(data.Results);
      })
      .catch((err) => console.log(err));
  };

  const vehicleMakeChanged = (_, value) => {
    setSelectedMakes(value);
  };

  const useYearChange = (e) => {
    if (e.target.value) {
      setIsYearValid(false);
    } else {
      setIsYearValid(true);
    }
    setUseYear(!useYear);
  };

  const onYearChange = (e) => {
    const value = e.target.value;
    if (useYear) {
      if (value.length === 4) {
        setIsYearValid(true);
      } else {
        setIsYearValid(false);
      }
    } else {
      setIsYearValid(true);
    }

    setSelectedYear(value);
  };

  const fetchModels = async () => {
    const isFormValid = validateVehicleForm(
      selectedVehicleType,
      selectedMakes,
      useYear,
      isYearValid
    );

    if (isFormValid === 0) {
      return;
    }

    setIsSearching(true);
    const models = await getModels(
      selectedVehicleType,
      selectedMakes,
      selectedYear
    );
    setModels(models);
    setIsSearching(false);
  };

  const isSearchActive = () => {
    const active =
      !focused &&
      validateVehicleForm(
        selectedVehicleType,
        selectedMakes,
        useYear,
        isYearValid
      ) === 1;
    console.log("active", active);
    return active;
  };

  return (
    <div>
      <h2>Car Search</h2>
      <div>
        <div className="field-control">
          <p>Vehicle Type</p>
          <FormControl fullWidth>
            <InputLabel id="vehicle-type-select-label">Vehicle Type</InputLabel>
            <Select
              labelId="vehicle-type-select-label"
              id="vehicle-type-select"
              //   value={age}
              label="Vehicle Type"
              onChange={vehcileTypeChanged}
            >
              {vehicleTypes.map((vehicleType) => (
                <MenuItem value={vehicleType.Name} key={vehicleType.Id}>
                  {vehicleType.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="field-control">
          <p>Make</p>
          {/* <FormControl fullWidth>
            <InputLabel id="vehicle-make-select-label">Make</InputLabel>
            <Select
              labelId="vehicle-make-select-label"
              id="vehicle-make-select"
              value={selectedMakes.map((make) => make.MakeName)}
              label="Make"
              onChange={vehicleMakeChanged}
              multiple={true}
              renderValue={(selected) => selected.join(", ")}
            >
              {vehicleMakes.map((make) => (
                <MenuItem value={make} key={make.MakeId}>
                  {make.MakeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <Autocomplete
            multiple
            id="tags-outlined"
            options={vehicleMakes}
            getOptionLabel={(option) => option.MakeName}
            // defaultValue={[top100Films[13]]}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Makes" placeholder="Makes" />
            )}
            onChange={vehicleMakeChanged}
          />
        </div>
        <div className="field-control">
          <p>Use Year?</p>
          <input type="checkbox" checked={useYear} onClick={useYearChange} />
          {useYear && (
            <>
              <input
                type="number"
                onChange={onYearChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              {!isYearValid && <p>Please enter valid year</p>}
            </>
          )}
        </div>
        <div className="field-control">
          <button
            onClick={fetchModels}
            className={
              isSearchActive()
                ? "search-button"
                : "search-button disabled-button"
            }
            disabled={!isSearchActive()}
          >
            Search
          </button>
          {isSearch && <p>Searching...</p>}
        </div>
      </div>
      <div>{models.length > 0 && <ModelTable models={models} />}</div>
    </div>
  );
};

export default CarSearch;
