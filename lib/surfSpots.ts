// lib/surfSpots.ts
export const surfSpots = [
  {
    name: "Bondi Beach",
    latitude: -33.890842,
    longitude: 151.274292,
    cameraUrl: "https://bondisurfclub.com/bondi-surf-cam/" 
  },
  {
    name: "Manly Beach", 
    latitude: -33.791693,
    longitude: 151.287632,
    cameraUrl: "https://www.swellnet.com/surfcams/manly"
  },
  {
    name: "Maroubra Beach",
    latitude: -33.948714,
    longitude: 151.257127,
    cameraUrl: "https://www.randwick.nsw.gov.au/facilities-and-recreation/beaches-and-coast/beaches/maroubra-beach"
  },
  {
    name: "Curl Curl Beach",
    latitude: -33.769318,
    longitude: 151.292159,
    cameraUrl: "https://www.stewarthouse.org.au/curl-curl-surf-cam/"
  },
  {
    name: "Wollongong",
    latitude: -34.424836,
    longitude: 150.902157,
    cameraUrl: "https://www.swellnet.com/surfcams/wollongong"
  },
  {
    name: "Cronulla Beaches",
    latitude: -34.050824,
    longitude: 151.153688,
    cameraUrl: "https://www.swellnet.com/surfcams/cronulla-beaches" 
  },
  {
    name: "Thirroul",
    latitude: -34.315090,
    longitude: 150.924109,
    cameraUrl: "https://www.swellnet.com/surfcams/thirroul" 
  },
  {
    name: "Palm Beach",
    latitude: -33.596916,
    longitude: 151.324218,
    cameraUrl: "https://www.palmbeachslsc.com/surf-cam" 
  }
] as const;

export type SurfSpot = {
  name: string;
  latitude: number;
  longitude: number;
  cameraUrl?: string;  
};