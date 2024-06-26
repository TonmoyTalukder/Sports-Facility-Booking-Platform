import { Request, Response } from 'express';
import User, { IUser } from './user.model';
import { generateToken } from '../../middleware/globalErrorhandler';
import { CustomError } from '../../utils/error';

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone, role, address } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Email already registered',
      });
      return;
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      role,
      address,
    }) as IUser & { _id: any };

    await newUser.save();

    // const token = generateToken(newUser._id.toString());

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User registered successfully',
      data: {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
      },
    });
  } catch (error: any) {
    // console.error('Error during user signup:', error);
    if (error.code === 11000) {
      throw new CustomError(`Duplicate entry: ${error.message}`, 400, [
        { path: '', message: error.message },
      ]);
    }

    throw new CustomError('Server error. Please try again later.', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = (await User.findOne({ email })) as IUser & { _id: any };

    if (!user) {
      // console.log('User not found');
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No Data Found',
        data: [],
      });
      return;
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password');
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid email or password',
      });
      return;
    }

    // Generate a token
    const token = generateToken(user._id.toString());

    // console.log('User logged in successfully');
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User logged in successfully',
      token,
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error: any) {
    // console.error('Error during user login:', error);
    if (error.code === 11000) {
      throw new CustomError(`Duplicate entry: ${error.message}`, 400, [
        { path: '', message: error.message },
      ]);
    }

    throw new CustomError('Server error. Please try again later.', 500);
  }
};
