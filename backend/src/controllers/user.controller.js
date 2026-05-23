import userModel from "../models/user.model.js";
import { generateToken } from "../utils/utils.js";
import cloudinary from "../services/cloudinary.js";

export const userSignup = async (req, res) => {
    const { email, password, fullName } = req.body;

    try {

        if(!email || !password || !fullName){
            return res.status(422).json({
                success: false,
                message: "Please provide all the required fields"
            })
        }

        const isExists = await userModel.findOne({
            email: email
        })

        if(isExists){
            return res.status(422).json({
                success: false,
                message: "Email is already used",
            })
        }

        const user = await userModel.create({
            email, password, fullName
        })

        const token = generateToken(user._id);

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "strict",
        //     maxAge: 3 * 24 * 60 * 60 * 1000
        // });

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            },
            token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create account",
            error: error.message
        });
    }
}

export const userLogin = async (req, res) => {

    const { email, password } = req.body;

    try{
        const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({
            success: false,
            message: "User is not registered"
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            success: false,
            message: "Incorrect Password"
        })
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: "Login successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        },
        token
    })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to login",
            error: error.message
        });
    }
}

/*
Controller to check user is authentication
 */

export const checkAuth = (req, res) => {
    try{
        res.status(200).json({
            success: true,
            message: "User is authenticated",
            user: req.user
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User is not authenticated",
            error: error.message
        });
    }
}

/*
Controller to update user profile
 */

export const updateProfile = async (req, res) => {
    const profilePhoto = req.file;
    const fullName = req.body.fullName;
    const bio = req.body.bio;

    try{
        const user = await userModel.findById(req.user._id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(profilePhoto){
            if(user.profilePhotoPublicId){
                await cloudinary.uploader.destroy(user.profilePhotoPublicId);
            }
            const upload = await cloudinary.uploader.upload(profilePhoto.path, {
                folder: "profile_photo",
                resource_type: "image"
            });
            user.profilePhoto = upload.secure_url;
            user.profilePhotoPublicId = upload.public_id;
        }

        if(bio){
            user.bio = bio;
        }

        if(fullName){
            user.fullName = fullName;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                bio: updatedUser.bio,
                profilePhoto: updatedUser.profilePhoto
            }
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
}

