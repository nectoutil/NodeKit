declare class Color {
  constructor(object: any, model?: string);

  toHex(): string;

  toRgba(): string;

  get hexa(): string;

  alpha(value: number);
}

export default Color;

export function toHex(color: string): string;
