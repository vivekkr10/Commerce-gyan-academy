import Subject from "../models/subject.model.js";

export const addSubjects = async (req, res) => {
  try {
    const { subjectName } = req.body;
    if (!subjectName) {
      return res.status(400).json({ message: "Subject field required" });
    }

    const normalizedName = subjectName.trim().toLowerCase();

    const existingSubject = await Subject.findOne({
      subjectName: normalizedName,
    });
    if (existingSubject) {
      return res.status(400).json({ message: "Subject already exist" });
    }

    // Create new subject
    const subject = new Subject({ subjectName: normalizedName });
    await subject.save();
    console.log("✅ Subject created:", subject._id);

    res.status(201).json({
      success: true,
      message: "Subject added Successfully",
      data: subject,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    await Subject.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
