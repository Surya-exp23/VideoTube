import mongoose, { isValidObjectId } from "mongoose"
import { comment as Comment } from "../models/comment.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.fullname": 1,
                "owner.avatar": 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ];

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const comments = await Comment.aggregatePaginate(Comment.aggregate(pipeline), options);

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
        throw new ApiError(404, "Comment not found");
    }

    if (existingComment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to edit this comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content,
                updatedAt: new Date()
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
        throw new ApiError(404, "Comment not found");
    }

    if (existingComment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
