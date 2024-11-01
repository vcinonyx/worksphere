const { deptAnnouncement: DepartmentAnnouncement, user: User, department: Department } = require("../models");

const handleError = (res, err, message = "An error occurred") => {
  console.error(err);
  res.status(500).send({ message });
};

exports.create = async (req, res) => {
  try {
    const { announcementTitle, announcementDescription, createdByUserId, departmentId } = req.body;

    if (!announcementTitle || !createdByUserId || !departmentId) {
      return res.status(400).send({ message: "Required fields are missing!" });
    }

    const newAnnouncement = await DepartmentAnnouncement.create({
      announcementTitle,
      announcementDescription,
      createdByUserId,
      departmentId,
      createdAt: new Date(),
    });

    res.send(newAnnouncement);
  } catch (err) {
    handleError(res, err, "Error creating the Department Announcement.");
  }
};

exports.findAll = async (req, res) => {
  try {
    const announcements = await DepartmentAnnouncement.findAll({
      include: [User, Department],
    });
    res.send(announcements);
  } catch (err) {
    handleError(res, err, "Error retrieving Department Announcements.");
  }
};

exports.findAllRecent = async (req, res) => {
  try {
    const announcements = await DepartmentAnnouncement.findAll({
      include: [User, Department],
      order: [["createdAt", "DESC"]],
      limit: 2,
    });
    res.send(announcements);
  } catch (err) {
    handleError(res, err, "Error retrieving recent Department Announcements.");
  }
};

exports.findAllRecentByDeptId = async (req, res) => {
  try {
    const { id: departmentId } = req.params;

    const announcements = await DepartmentAnnouncement.findAll({
      include: [User, { model: Department, where: { id: departmentId } }],
      order: [["createdAt", "DESC"]],
      limit: 2,
    });
    res.send(announcements);
  } catch (err) {
    handleError(res, err, "Error retrieving recent Department Announcements for the department.");
  }
};

exports.findAllByDeptId = async (req, res) => {
  try {
    const { id: departmentId } = req.params;

    const announcements = await DepartmentAnnouncement.findAll({
      include: [User, Department],
      where: { departmentId },
    });
    res.send(announcements);
  } catch (err) {
    handleError(res, err, "Error retrieving Department Announcements for the department.");
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await DepartmentAnnouncement.findByPk(id);

    if (!announcement) {
      return res.status(404).send({ message: `Announcement with id=${id} not found.` });
    }

    res.send(announcement);
  } catch (err) {
    handleError(res, err, `Error retrieving Department Announcement with id=${id}.`);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await DepartmentAnnouncement.update(req.body, { where: { id } });

    if (updated) {
      res.send({ message: "Department Announcement updated successfully." });
    } else {
      res.status(404).send({
        message: `Cannot update Department Announcement with id=${id}. It may not exist or the request body is empty.`,
      });
    }
  } catch (err) {
    handleError(res, err, `Error updating Department Announcement with id=${id}.`);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await DepartmentAnnouncement.destroy({ where: { id } });

    if (deleted) {
      res.send({ message: "Department Announcement deleted successfully!" });
    } else {
      res.status(404).send({ message: `Cannot delete Department Announcement with id=${id}. It may not exist.` });
    }
  } catch (err) {
    handleError(res, err, `Error deleting Department Announcement with id=${id}.`);
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deletedCount = await DepartmentAnnouncement.destroy({ where: {}, truncate: false });
    res.send({ message: `${deletedCount} Department Announcements were deleted successfully!` });
  } catch (err) {
    handleError(res, err, "Error deleting all Department Announcements.");
  }
};

exports.deleteAllByDeptId = async (req, res) => {
  try {
    const { id: departmentId } = req.params;

    const deletedCount = await DepartmentAnnouncement.destroy({ where: { departmentId }, truncate: false });
    res.send({ message: `${deletedCount} Department Announcements for Department ID ${departmentId} were deleted successfully!` });
  } catch (err) {
    handleError(res, err, "Error deleting Department Announcements for the department.");
  }
};
