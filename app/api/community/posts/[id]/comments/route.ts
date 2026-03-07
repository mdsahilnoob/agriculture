import { type NextRequest, NextResponse } from "next/server"

const comments: { [postId: number]: any[] } = {}
let nextCommentId = 1

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id)
    const postComments = comments[postId] || []

    return NextResponse.json({
      success: true,
      comments: postComments,
    })
  } catch (error) {
    console.error("[v0] Error fetching comments:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id)
    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Comment content is required" }, { status: 400 })
    }

    if (!comments[postId]) {
      comments[postId] = []
    }

    const newComment = {
      id: nextCommentId++,
      author: "Anonymous Farmer",
      avatar: "/placeholder.svg?height=40&width=40",
      content: content.trim(),
      createdAt: new Date().toISOString(),
      userId: "anonymous",
    }

    comments[postId].push(newComment)

    console.log("[v0] New comment added to post:", postId)

    return NextResponse.json({
      success: true,
      comment: newComment,
    })
  } catch (error) {
    console.error("[v0] Error creating comment:", error)
    return NextResponse.json({ success: false, error: "Failed to create comment" }, { status: 500 })
  }
}
