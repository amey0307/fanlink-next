export const runtime = 'nodejs';

import mongoDB_Connection from '@/app/model/db';
import Ticket from '@/app/model/ticket.model';
import { EventData, TicketData, UserData } from '@/app/type/util';
import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import Event from '@/app/model/event.model';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');

    if (!eventId) {
        return NextResponse.json({ message: 'Missing eventId' }, { status: 400 });
    }

    // Example: fetch ticket data from DB here
    await mongoDB_Connection();
    const tickets: TicketData[] | null = await Ticket.find({ eventId: eventId, userId: userId });
    const event: EventData | null = await Event.findOne({ eventId: eventId });
    if (!tickets) {
        return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    // HTML template for the ticket
    const html = `
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>Event Ticket</title>
            <link href="https://fonts.googleapis.com/css?family=Inter:400,600&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Inter', Arial, sans-serif;
                    background: #f8fafc;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 700px;
                    margin: 40px auto;
                    padding: 32px;
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 8px 32px rgba(30,41,59,0.10), 0 1.5px 4px rgba(30,41,59,0.04);
                }
                h1 {
                    color: #0f172a;
                    font-size: 2.2rem;
                    font-weight: 600;
                    margin-bottom: 32px;
                    letter-spacing: -1px;
                    text-align: center;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 14px;
                }
                .label {
                    font-weight: 600;
                    color: #334155;
                    min-width: 90px;
                }
                .value {
                    color: #475569;
                    font-weight: 400;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 32px;
                }
                th, td {
                    border: 1px solid #e2e8f0;
                    padding: 10px 8px;
                    text-align: center;
                }
                th {
                    background: #f1f5f9;
                    color: #334155;
                    font-weight: 600;
                }
                td {
                    background: #fff;
                    color: #0f172a;
                    font-size: 1rem;
                }
                .code {
                    font-family: 'Fira Mono', monospace;
                    background: #e2e8f0;
                    color: #0f172a;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 1rem;
                    letter-spacing: 1px;
                    display: inline-block;
                }
                @media (max-width: 600px) {
                    .container { padding: 10px; }
                    h1 { font-size: 1.3rem; }
                    table, th, td { font-size: 0.9rem; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Your Event Ticket(s)</h1>
                <div class="info-row"><span class="label">Event:</span> <span class="value">${event?.eventName}</span></div>
                <div class="info-row"><span class="label">Event Date:</span> <span class="value">${event?.eventDate}</span></div>
                <div class="info-row"><span class="label">Location:</span> <span class="value">${event?.location}</span></div>
                <div class="info-row"><span class="label">Name:</span> <span class="value">${tickets[0]?.name}</span></div>
                <div class="info-row"><span class="label">Email:</span> <span class="value">${tickets[0]?.email}</span></div>
                <div class="info-row"><span class="label">Phone:</span> <span class="value">${tickets[0]?.phone}</span></div>
                <table>
                    <thead>
                        <tr>
                            <th>Ticket Code</th>
                            <th>Seat Number</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tickets?.map((ticket: TicketData) => `
                            <tr>
                                <td><span class="code">${ticket.ticketId}</span></td>
                                <td>${ticket.seatNumber || '-'}</td>
                                <td>${event?.eventDate || '-'}</td>
                                <td>${ticket.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </body>
    </html>
    `;

    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(), // THIS IS CRUCIAL
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="ticket.pdf"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error generating PDF: ' + error }, { status: 500 });
    }
}