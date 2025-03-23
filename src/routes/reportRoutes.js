const express = require("express");
const { getReports, createReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/", getReports);  // Lấy danh sách báo cáo
router.post("/", createReport);  // Gửi báo cáo mới

module.exports = router;
