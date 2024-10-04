import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  const room = (<DB>DB).rooms.find((x) => x.roomId == roomId);
  if (!room) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const message = (<DB>DB).messages.filter((x) => x.roomId == roomId);
  return NextResponse.json({
    ok: true,
    message,
  });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { roomId, messageText } = body;
  readDB();

  const room = (<DB>DB).rooms.find((x) => x.roomId === roomId);
  if (!room) {
    return NextResponse.json(
      {
        ok: false,
        message: "Room is not found",
      },
      { status: 404 }
    );
  }


  const messageId = nanoid();
  (<DB>DB).messages.push({
    roomId,
    messageId,
    messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  if (!payload || typeof payload !== 'object' || payload.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { messageId } = body;


  readDB();
  const messageIdx = (<DB>DB).messages.findIndex((x) => x.messageId === messageId);
  if(messageIdx === -1){
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  (<DB>DB).messages.splice(messageIdx, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};