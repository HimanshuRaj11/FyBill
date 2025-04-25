// types/escpos-usb.d.ts
declare module 'escpos-usb' {
    import { Adapter } from 'escpos';

    class USBAdapter implements Adapter {
        constructor(vid?: number, pid?: number);
        open(cb?: (error?: Error) => void): void;
        write(data: Buffer, cb?: (error?: Error) => void): void;
        close(cb?: (error?: Error) => void): void;
        device: any; // USB device, typically from 'usb' library
    }

    export = USBAdapter;
}