// /api/game

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";


export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession()
    if(!session?.user) {
      return NextResponse.json(
        {
        error: "You must be logged in",
        },
        {
          status: 401
        }
      );
    }
    const body = await req.json()
    const {amount, topic, type} = quizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic
      }
    })
  } catch (error) {
    if(error instanceof ZodError){
      return NextResponse.json(
        {
          error: error.issues
        },
        {
          status: 400
        }
      );
    }
  }
}
