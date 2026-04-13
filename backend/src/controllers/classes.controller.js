import Classes from "../models/classes.model.js";

export const addClass = async (req, res) => {
  try {
    const { classesName } = req.body;
    if (!classesName) {
      return res.status(400).json({ message: "Class field required" });
    }

    const normalizedName = classesName.toLowerCase().trim();
    const existingclasses = await Classes.findOne({
      classesName: normalizedName,
    });
    if (existingclasses) {
      return res.status(400).json({ message: "Class already exist" });
    }

    //create new class
    const classes = await Classes.create({
      classesName: normalizedName,
    });
    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: classes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classes = await Classes.findById(id);
    if (!classes) {
      return res.status(404).json({ message: "Class not found" });
    }
    await Classes.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
