export interface IVideoConstraints {
  frameRate?: { ideal: number, max: number };
  facingMode?: "user" | "environment";
  width: { min: number, ideal: number, max: number };
  height: { min: number, ideal: number, max: number };
}
