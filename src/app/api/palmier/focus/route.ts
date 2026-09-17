import { NextResponse } from "next/server"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { palmierStatus } from "@/lib/palmier"

const exec = promisify(execFile)

export async function POST() {
  try {
    await exec("/usr/bin/open", ["-a", "PalmierPro"])
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not open Palmier Pro" },
      { status: 500 }
    )
  }
  const palmier = await palmierStatus()
  return NextResponse.json({ ok: true, palmier })
}
