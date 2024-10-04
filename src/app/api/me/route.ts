import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Wachirawit Chaiyamat",
    studentId: "660612156",
  });
};
