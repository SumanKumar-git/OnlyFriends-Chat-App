import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        minLenth: [3, "Full name must be at least 3 characters long"],
        maxLength: [30, "Full name must be at most 30 characters long"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should contain more than 6 character"],
        select: false
    },
    profilePhoto: {
        type: String
    },
    profilePhotoPublicId: {
        type: String
    },
    bio: {
        type: String,
        default: "Available",
        trim: true
    },
}, { timestamps: true });

userSchema.pre("save", async function() {
    if(!this.isModified("password")){
        return ;
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return ;
})

userSchema.methods.comparePassword = async function(password){

    return await bcrypt.compare(password, this.password);
}


const userModel = mongoose.model("user", userSchema);
export default userModel;