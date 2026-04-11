import Teacher from "../models/teacher.model.js";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";

export const getTeacherProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const teacher = await Teacher.findOne({ user: user.id });
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        teacherDetails: teacher || {},
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
