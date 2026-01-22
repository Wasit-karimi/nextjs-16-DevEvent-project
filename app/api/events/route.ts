//cloudinary service are not available in our country because of that we use the local endpoint

// import Event from "@/database/event.model";
// import connectDB from "@/lib/mongodb";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const formData = await req.formData();
//     let event;
//     try {
//       event = Object.fromEntries(formData.entries());
//     } catch (e) {
//       return NextResponse.json(
//         { message: "Invalid JSON data format" },
//         { status: 400 },
//       );
//     }

//     const file = formData.get("image") as File;
//     if(!file) return NextResponse.json({message: "Image is required"}, {status: 400})
//     if (file) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       event = { ...event, image: buffer };
//     }

//     const arrayBuffer = await file.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)
//     const createdEvent = await Event.create(event);
//     return NextResponse.json(
//       { message: "Event Created", event: createdEvent },
//       { status: 201 },
//     );
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json(
//       {
//         message: "Event Creation Failed",
//         error: e instanceof Error ? e.message : "Unknown",
//       },
//       { status: 500 },
//     );
//   }
// }


import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const file = formData.get("image") as File | null;
    if (!file) return NextResponse.json({ message: "Image is required" },{ status: 400 });
      
    const tagsRaw = formData.get("tags");
const agendaRaw = formData.get("agenda");

if (!tagsRaw || !agendaRaw) {
  return NextResponse.json(
    { message: "Tags and agenda are required" },
    { status: 400 }
  );
}

let tags: string[];
let agenda: string[];

try {
  tags = JSON.parse(tagsRaw as string);
  agenda = JSON.parse(agendaRaw as string);
} catch {
  return NextResponse.json(
    { message: "Invalid JSON format for tags or agenda" },
    { status: 400 }
  );
}
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename
    const fileExt = path.extname(file.name);
    const fileName = `event-${Date.now()}${fileExt}`;

    // Save path
    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      fileName
    );

    // Save file
    await fs.writeFile(uploadPath, buffer);

    // Save image URL in DB
    const createdEvent = await Event.create({
      ...data,
      image: `/uploads/${fileName}`,
      tags: tags,
      agenda: agenda
    });

    return NextResponse.json(
      { message: "Event Created", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectDB()
    const events = await Event.find().sort({createdAt: -1})
    return NextResponse.json({message: "Events fetched successfully", events})

  } catch(e) {
    return NextResponse.json({message: "Event fetching failed", error: e}, {status: 400})
  }
}