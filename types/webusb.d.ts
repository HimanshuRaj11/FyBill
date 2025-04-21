interface Navigator {
    usb: USB;
}

interface USB {
    getDevices(): Promise<USBDevice[]>;
    requestDevice(options?: USBDeviceRequestOptions): Promise<USBDevice>;
}

interface USBDevice {
    open(): Promise<void>;
    configurations: USBConfiguration[];
    close(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    releaseInterface(interfaceNumber: number): Promise<void>;
    transferOut(endpointNumber: number, data: ArrayBuffer | ArrayBufferView): Promise<USBOutTransferResult>;
    productName?: string;
    vendorId: number;
    productId: number;
    endpointNumber: number;
    direction: "in" | "out";
    type: string;
    endpoints: USBEndpoint[];
    packetSize: number;
    alternates: USBAlternateInterface[];
}

interface USBDeviceRequestOptions {
    filters: Array<{ vendorId?: number; productId?: number }>;
}

interface USBOutTransferResult {
    status: string;
    bytesWritten: number;
}

