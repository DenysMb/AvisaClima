export interface Weather {
    id: number;
    name: string;
    state: string;
    country: string;
    meteogram: string;
    data?: (DataEntity)[] | null;
  }
  export interface DataEntity {
    date: string;
    date_br: string;
    humidity: HumidityOrTemperature;
    pressure: Pressure;
    rain: Rain;
    wind: Wind;
    uv: Uv;
    thermal_sensation: DawnOrMorningOrAfternoonOrNightOrThermalSensation;
    text_icon: TextIcon;
    temperature: HumidityOrTemperature;
    cloud_coverage: CloudCoverage;
    sun: Sun;
  }
  export interface HumidityOrTemperature {
    min: number;
    max: number;
    dawn: DawnOrMorningOrAfternoonOrNightOrThermalSensation;
    morning: DawnOrMorningOrAfternoonOrNightOrThermalSensation;
    afternoon: DawnOrMorningOrAfternoonOrNightOrThermalSensation;
    night: DawnOrMorningOrAfternoonOrNightOrThermalSensation;
  }
  export interface DawnOrMorningOrAfternoonOrNightOrThermalSensation {
    min: number;
    max: number;
  }
  export interface Pressure {
    pressure: number;
  }
  export interface Rain {
    probability: number;
    precipitation: number;
  }
  export interface Wind {
    velocity_min: number;
    velocity_max: number;
    velocity_avg: number;
    gust_max: number;
    direction_degrees: number;
    direction: string;
    dawn: DawnOrMorningOrAfternoonOrNight;
    morning: DawnOrMorningOrAfternoonOrNight;
    afternoon: DawnOrMorningOrAfternoonOrNight;
    night: DawnOrMorningOrAfternoonOrNight;
  }
  export interface DawnOrMorningOrAfternoonOrNight {
    direction: string;
    direction_degrees: number;
    gust_max: number;
    velocity_max: number;
    velocity_avg: number;
  }
  export interface Uv {
    max: number;
  }
  export interface TextIcon {
    icon: Icon;
    text: Text;
  }
  export interface Icon {
    dawn: string;
    morning: string;
    afternoon: string;
    night: string;
    day: string;
  }
  export interface Text {
    pt: string;
    en: string;
    es: string;
    phrase: Phrase;
  }
  export interface Phrase {
    reduced: string;
    morning: string;
    afternoon: string;
    night: string;
    dawn: string;
  }
  export interface CloudCoverage {
    low: number;
    mid: number;
    high: number;
    dawn: DawnOrMorningOrAfternoonOrNight1;
    morning: DawnOrMorningOrAfternoonOrNight1;
    afternoon: DawnOrMorningOrAfternoonOrNight1;
    night: DawnOrMorningOrAfternoonOrNight1;
  }
  export interface DawnOrMorningOrAfternoonOrNight1 {
    low: number;
    mid: number;
    high: number;
  }
  export interface Sun {
    sunrise: string;
    sunset: string;
  }
  