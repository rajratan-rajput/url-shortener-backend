import {
  registerUser,
  loginUser,
  logoutUser,
} from "../services/authService.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../utils/validateAuth.js";

export const register = async (req, res, next) => {
  try {
    const validation = validateRegisterInput(req.body);
    if (!validation.ok) {
      res.status(400);
      throw new Error(validation.message);
    }

    const { user, token } = await registerUser(validation.data);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error.statusCode === 409) res.status(409);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validation = validateLoginInput(req.body);
    if (!validation.ok) {
      res.status(400);
      throw new Error(validation.message);
    }

    const { user, token } = await loginUser(validation.data);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error.statusCode === 401) res.status(401);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    await logoutUser(token);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
};
