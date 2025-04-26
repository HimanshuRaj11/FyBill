'use client'
import { render, Printer, Text } from 'react-thermal-printer';
import { useEffect, useState } from 'react';

const PrintReceipt = async (data: Uint8Array) => {

    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 }); // Adjust baudRate if needed
    const writer = port.writable?.getWriter();

    if (writer) {
        await writer.write(data);
        writer.releaseLock();
        await port.close();
    }
};

const PrintBill = ({ Invoice }: { Invoice: any }) => {
    const [PrintStatus, setPrinterStatus] = useState(true)
    useEffect(() => {
        const renderReceipt = async () => {
            try {
                const data = await render(
                    <Printer type="epson">
                        <Text align="center" bold >
                            Receipt
                        </Text>
                        <Text>Order ID: {Invoice._id}</Text>
                        {/* Add more receipt details here */}
                    </Printer>
                );
                await PrintReceipt(data);

            } catch (error) {
                console.log(error);

            }

        };

        renderReceipt();
    }, [Invoice]);

    return <div>{PrintStatus ? " Printing" : ""}</div>;
};

export default PrintBill;