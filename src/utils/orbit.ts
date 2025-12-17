export type OrbitBand = "inner" | "middle" | "outer";

export interface OrbitConfig {
  band: OrbitBand;
  radius: number;
  speed: number;
}

export function getOrbitConfig(urgency: number): OrbitConfig {
  if (urgency >= 70) {
    return {
      band: "inner",
      radius: 110,
      speed: 40,
    };
  }

  if (urgency >= 30) {
    return {
      band: "middle",
      radius: 160,
      speed: 60,
    };
  }

  return {
    band: "outer",
    radius: 210,
    speed: 80,
  };
}
