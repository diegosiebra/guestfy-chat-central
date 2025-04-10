
export interface PropertyImage {
  _id: string;
  url: string;
  _msname?: {
    pt_BR?: string;
    en_US?: string;
    es_ES?: string;
    pt_PT?: string;
    [key: string]: string | undefined;
  };
  area: string;
}

export interface PropertyAddress {
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  region: string;
  street: string;
  streetNumber: string;
  additional?: string;
  zip: string;
}

export interface PropertyOwner {
  name: string;
  phones: { iso: string }[];
}

export interface Property {
  _id: string;
  id: string;
  _idproperty: string;
  internalName: string;
  _mstitle: {
    pt_BR: string;
    [key: string]: string | undefined;
  };
  _msdesc: {
    pt_BR: string;
    [key: string]: string | undefined;
  };
  _mshouserules?: {
    pt_BR: string;
    [key: string]: string | undefined;
  };
  _mssummary?: {
    pt_BR: string;
    [key: string]: string | undefined;
  };
  status: string;
  _i_maxGuests: number;
  _i_rooms: number;
  _i_beds: number;
  _f_bathrooms: number;
  address: PropertyAddress;
  latLng?: {
    _f_lat: number;
    _f_lng: number;
  };
  amenities: { _id: string }[];
  deff_curr: string;
  _f_square?: number;
  _idmainImage: string;
  _t_mainImageMeta: {
    url: string;
  };
  images: { _id: string }[];
  _t_imagesMeta: PropertyImage[];
  instantBooking: boolean;
  owner: PropertyOwner;
  groupIds?: string[];
}
