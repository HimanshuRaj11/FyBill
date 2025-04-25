// Assuming data is an array of Uint8Array containing the printing commands
import { render, Printer, Text } from 'react-thermal-printer';
import { useEffect } from 'react';

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
    useEffect(() => {
        const renderReceipt = async () => {
            const data = await render(
                <Printer type="epson">
                    <Text align="center" bold >
                        Receipt
                    </Text>
                    <Text>Order ID: {Invoice.id}</Text>
                    {/* Add more receipt details here */}
                </Printer>
            );
            await PrintReceipt(data);
        };

        renderReceipt();
    }, [Invoice]);

    return <div>Printing receipt...</div>;
};

export default PrintBill;