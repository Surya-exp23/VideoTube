import mongoose, { isValidObjectId } from "mongoose"
import { Likes } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const like = await Likes.findOne({
        video: videoId,
        likedby: req.user._id
    });

    if (like) {
        await Likes.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Video like removed"));
    } else {
        const newLike = await Likes.create({
            video: videoId,
            likedby: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return res.status(200).json(new ApiResponse(200, { liked: true, like: newLike }, "Video liked"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    const like = await Likes.findOne({
        comment: commentId,
        likedby: req.user._id
    });

    if (like) {
        await Likes.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Comment like removed"));
    } else {
        const newLike = await Likes.create({
            comment: commentId,
            likedby: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return res.status(200).json(new ApiResponse(200, { liked: true, like: newLike }, "Comment liked"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    const like = await Likes.findOne({
        tweet: tweetId,
        likedby: req.user._id
    });

    if (like) {
        await Likes.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Tweet like removed"));
    } else {
        const newLike = await Likes.create({
            tweet: tweetId,
            likedby: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return res.status(200).json(new ApiResponse(200, { liked: true, like: newLike }, "Tweet liked"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Likes.aggregate([
        {
            $match: {
                likedby: new mongoose.Types.ObjectId(req.user._id),
                video: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $project: {
                _id: 1,
                "videoDetails._id": 1,
                "videoDetails.title": 1,
                "videoDetails.description": 1,
                "videoDetails.thumbnail": 1,
                "videoDetails.duration": 1,
                "videoDetails.views": 1,
                "videoDetails.owner": 1
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
