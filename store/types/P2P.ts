export interface IVideoConstraints {
  frameRate?: { ideal: number; max: number };
  facingMode?: "user" | "environment";
  width: { min: number; ideal: number; max: number };
  height: { min: number; ideal: number; max: number };
}

export interface ISendFileUID {
  file: File;
  uid: string;
}

export interface ISendTextUID {
  text: string;
  uid: string;
}

export interface IUserStream {
  uid: string;
  stream: MediaStream;
}

export interface IUserStreamList {
  [key: string]: MediaStream
}
