'use client'
import { render, Printer, Text } from 'react-thermal-printer';
import { useEffect, useState } from 'react';

const PrintReceiptUSB = async (data: Uint8Array) => {
    try {
        const device = await navigator.usb.requestDevice({
            filters: [
                { vendorId: 1305 }
            ]
        });
        console.log(device.vendorId, device.productId);
        navigator.usb.requestDevice({ filters: [] })
            .then(device => console.log(device))
            .catch(error => console.error(error));



        await device.open();
        if (device.configuration === null) {
            await device.selectConfiguration(1);
        }
        await device.claimInterface(0); // usually 0, but depends on printer
        await device.transferOut(1, data); // endpoint number could vary

        await device.close();
    } catch (error) {
        console.error("USB print error:", error);
        throw error;
    }
};

const PrintBill = ({ Invoice }: { Invoice: any }) => {
    const [printStatus, setPrintStatus] = useState<'printing' | 'done' | 'error'>('printing');

    useEffect(() => {
        const renderReceipt = async () => {
            try {
                const data = await render(
                    <Printer type="star"> {/* if your printer supports STAR commands */}
                        <Text align="center" bold>
                            Receipt
                        </Text>
                        <Text>Order ID: {Invoice?.orderId}</Text>
                        {/* Add more invoice details here */}
                    </Printer>
                );

                await PrintReceiptUSB(data);
                setPrintStatus('done');
            } catch (error) {
                setPrintStatus('error');
            }
        };

        renderReceipt();
    }, [Invoice]);

    return (
        <div>
            {printStatus === 'printing' && "Printing..."}
            {printStatus === 'done' && "Print Done!"}
            {printStatus === 'error' && "Failed to Print!"}
        </div>
    );
};

export default PrintBill;
