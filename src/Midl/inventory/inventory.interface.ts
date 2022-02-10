import axios from "axios";

import { ApplicationError } from "../../lib";
import {
  citiesApiUrl,
  countriesApiUrl,
  DefaultErrorMessage,
  statesApiUrl,
} from "../meta-products/settings";

async function getCountries() {
  try {
    const res = await axios.get<{
      error: boolean;
      msg: string;
      data: Array<{ name: string; iso2: string; long: number; lat: number }>;
    }>(countriesApiUrl);
    return res.data.data.map((d) => d.name);
  } catch (error) {
    return new ApplicationError().handleDefaultError(
      "Countries Fetch",
      DefaultErrorMessage,
      "error"
    );
  }
}

async function getStatesByCountry(country: string) {
  try {
    const res = await axios.post<{
      error: boolean;
      msg: string;
      data: {
        name: string;
        iso3: string;
        states: Array<{ name: string; state_code: string }>;
      };
    }>(statesApiUrl, {
      country: country,
    });
    return res.data.data.states;
  } catch (error) {
    return new ApplicationError().handleDefaultError(
      "States Fetch",
      DefaultErrorMessage,
      "error"
    );
  }
}

async function getCitiesByCountryAndState(country: string, state: string) {
  try {
    const res = await axios.post<{
      error: string;
      msg: string;
      data: Array<string>;
    }>(citiesApiUrl, { country: country, state: state });
    return res.data.data;
  } catch (error) {
    return new ApplicationError().handleDefaultError(
      "Cities Fetch",
      DefaultErrorMessage,
      "error"
    );
  }
}

export interface TInventoryGeoLocationInterface {
  getCountries: typeof getCountries;
  getStatesByCountry: typeof getStatesByCountry;
  getCitiesByCountryAndState: typeof getCitiesByCountryAndState;
}

export function InventoryGeoLocationInterface(): TInventoryGeoLocationInterface {
  return {
    getCountries,
    getStatesByCountry,
    getCitiesByCountryAndState,
  };
}
