import { type NextRequest, NextResponse } from "next/server"

const userLikes: { [userId: string]: number[] } = {}

const posts: any = []

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id)
    const userId = "anonymous"

    if (!userLikes[userId]) {
      userLikes[userId] = []
    }

    interface Post {
      id: number
      likes: number
    }

    const postIndex: number = (posts as Post[]).findIndex((p: Post) => p.id === postId)
    if (postIndex === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    const hasLiked = userLikes[userId].includes(postId)

    if (hasLiked) {
      userLikes[userId] = userLikes[userId].filter((id) => id !== postId)
      posts[postIndex].likes = Math.max(0, posts[postIndex].likes - 1)
    } else {
      userLikes[userId].push(postId)
      posts[postIndex].likes += 1
    }

    console.log("[v0] Post like toggled:", postId, hasLiked ? "unliked" : "liked")

    return NextResponse.json({
      success: true,
      liked: !hasLiked,
      likes: posts[postIndex].likes,
    })
  } catch (error) {
    console.error("[v0] Error toggling like:", error)
    return NextResponse.json({ success: false, error: "Failed to toggle like" }, { status: 500 })
  }
}
