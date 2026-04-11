import Student from "../models/student.model.js";
import User from "../models/user.model.js";

export const getStudentById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }
    const student = await Student.findOne({ user: user.id });

    res.json({
      success: true,
      data: {
        ...user._doc,
        studentDetails: student || {},
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, avatar, rollNumber, gender, address, course } =
      req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, avatar },
      { new: true },
    ).select("-password");

    // Update Student collection
    let student = await Student.findOne({ user: user._id });
    if (student) {
      student.rollNumber = rollNumber || student.rollNumber;
      student.gender = gender || student.gender;
      student.address = address || student.address;
      student.course = course || student.course;

      await student.save();
    } else {
      student = await Student.create({
        user: user._id,
        rollNumber,
        gender,
        address,
        course,
      });
    }
    res.json({
      success: true,
      message: "Profile Updated successfully",
      data: { ...user._doc, studentDetails: student },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
