export interface Device {
  id_u: number;
  nazwa_urzadzenia: string;
  ilosc_portow: number;
}

export interface DeviceType {
  id_typu: number;
  typ_u: string;
  id_u: number;
}

export interface PortConnection {
  id_p_1: number;
  id_p_2: number;
  max_predkosc: string;
}

export interface Port {
  id_p: number;
  nazwa: string;
  status: string;
  typ: 'RJ45' | 'SFP';
  id_u: number;
  predkosc_portu?: PortSpeed;
  polaczenia_portu: PortConnection[];
}

export interface WifiConnection {
  id_k_1: number;
  id_k_2: number;
  max_predkosc: string;
  pasmo: string;
}

export interface WifiBand {
  id_k: number;
  pasmo24GHz: number;
  pasmo5GHz: number;
  pasmo6GHz: number;
}

export interface WifiVersion {
  id_k: number;
  wersja: 'B' | 'G' | 'N' | 'AC' | 'AX' | 'BE';
}

export interface WifiSpeed {
  id_k: number;
  predkosc: number;
}

export interface WifiCard {
  id_k: number;
  nazwa: string;
  status: string;
  id_u: number;
  pasmo: WifiBand;
  wersja: WifiVersion;
  predkosc: WifiSpeed;
  polaczenia_karty: WifiConnection[];
}

export interface PortSpeed {
  id_p: number;
  predkosc: '10Mb/s' | '100Mb/s' | '1Gb/s' | '2,5Gb/s' | '5Gb/s' | '10Gb/s' | '25Gb/s';
}

export interface MacAddress {
  id_u: number;
  MAC: string;
}

export interface Location {
  id_u: number;
  miejsce: string;
  szafa: string;
  rack: string;
}

export interface DeviceDetails {
  urzadzenie: Device;
  typ: DeviceType;
  porty: Port[];
  karty_wifi: WifiCard[];
  mac: MacAddress;
  lokalizacja: Location;
}