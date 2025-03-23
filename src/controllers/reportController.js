const Report = require("../models/ReportModels.js");

// Lấy danh sách báo cáo
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("reportedBy", "username email");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Gửi báo cáo mới
const createReport = async (req, res) => {
  try {
    const { reportedBy, type, targetId, reason } = req.body;

    if (!reportedBy || !type || !targetId || !reason) {
      return res.status(400).json({ message: "Thiếu thông tin báo cáo" });
    }

    const newReport = new Report({ reportedBy, type, targetId, reason });
    await newReport.save();

    res.status(201).json({ message: "Báo cáo đã gửi thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { getReports, createReport };
