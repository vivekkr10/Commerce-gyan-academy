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

export const updateTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, avatar, subject, qualification, bio, courses, experience } =
      req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, avatar },
      { new: true },
    ).select("-password");

    // Update Teacher collection
    let teacher = await Teacher.findOne({ user: user._id });
    if (teacher) {
      teacher.subject = subject || teacher.subject;
      teacher.qualification = qualification || teacher.qualification;
      teacher.bio = bio || teacher.bio;
      teacher.courses = courses || teacher.courses;
      teacher.experience = experience || teacher.experience;

      await teacher.save();
    } else {
      teacher = await Teacher.create({
        user: user._id,
        subject,
        qualification,
        bio,
        courses,
        experience,
      });
    }
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { ...user._doc, teacherDetails: teacher },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
