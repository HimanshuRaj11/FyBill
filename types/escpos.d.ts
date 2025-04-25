// types/escpos.d.ts
declare module 'escpos' {
    export class Printer {
        constructor(adapter: Adapter, options?: { encoding?: string });
        open(cb?: (error?: Error) => void): this;
        font(type: 'A' | 'B' | 'C'): this;
        align(align: 'LT' | 'CT' | 'RT'): this;
        style(type: 'NORMAL' | 'BOLD' | 'ITALIC' | 'UNDERLINE'): this;
        size(width: number, height: number): this;
        spacing(nDot: number): this;
        lineSpace(n: number): this;
        text(content: string, encoding?: string): this;
        table(columns: { width: number; align: 'LEFT' | 'CENTER' | 'RIGHT' }[], data: string[][]): this;
        print(content: string): this;
        println(content: string): this;
        newLine(): this;
        cut(partial?: boolean): this;
        close(cb?: (error?: Error) => void): this;
        raw(content: Buffer): this;
        encode(encoding: string): this;
        barcode(code: string, type: 'UPC-A' | 'UPC-E' | 'EAN13' | 'EAN8' | 'CODE39' | 'ITF' | 'CODABAR'): this;
    }

    export interface Adapter {
        open(cb?: (error?: Error) => void): void;
        write(data: Buffer, cb?: (error?: Error) => void): void;
        close(cb?: (error?: Error) => void): void;
    }

    export const USB: {
        new(vid?: number, pid?: number): USBAdapter;
    };

    export interface USBAdapter extends Adapter {
        device: any; // USB device, type depends on implementation
    }

    export function getDevice(adapter: Adapter): Printer;
}