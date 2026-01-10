import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  // Registration logic here
  //res.status(200).json({ message: "Hello dear Anish" }); //testing purpose
  //Real Registration Process:=
  // 1. Get the users details from the frontend
  // 2. Validate the data (not empty)
  // 3. Check if user already exists : username and email
  // 4. check for images, check for avatar
  // 5. upload them to cloudinary, check avatar
  // 6. Store the user in DB by creating an object for the user model
  // 7. remove password and refresh token field from the response
  // 8. check for user creation success
  // 9. Send response back to the client

  const { fullName, email, username, password } = req.body; //Geting the users details [1.]
  console.log(fullName, email, username, password);

  /*if(fullName === ""){
    throw new ApiError(400, "Fullname is required")
  }*/

  if (
    [fullName, email, username, password].some((field) =>
      field?.trim() === "") ///.some() will check all the elemments of the array are provoided or not
  ){
    throw new ApiError (400, "All fields as required"); // Validates the data i.e. not empty [2.]
  }
  
  const existedUser = User.findOne({
    $or: [{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409, "User with email or username already exists"); //Checking for user already existed [3.]
  }

  const avatarLocalPath = req.files?.avatar[0]?.path; //It's in server not in cloudinary
  const coverImageLocalPath = req.files?.coverImage[0]?.path; 

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required"); //Checking for avatar before uploading [4.]
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); //Uploading on Cloudinary [5.]
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiError(400, "Avatar file is required"); //Checking for avatar after uploading [5.]
  }

  const user = await User.create({  
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || " " ,
    email,
    password,
    username: username.toLowerCase() 
  })   //Storing the user in DB by creating an object for the user model [6.]

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"  //To remove password and refreshToken after creation of user [7.]
  )

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user"); //Check for user creation [8.]
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully") //Sending res to the client [9.]
  )


});
