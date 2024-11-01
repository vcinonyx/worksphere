const { userPersonalEvent: PersonalEvent } = require("../models");

const handleError = (res, err, message = "An error occurred") => {
  console.error(err);
  res.status(500).send({ message });
};

exports.create = async (req, res) => {
  try {
    const { eventTitle, eventDescription, eventStartDate, eventEndDate, userId } = req.body;

    if (!eventTitle || !eventStartDate || !userId) {
      return res.status(400).send({ message: "Missing required fields!" });
    }

    const newEvent = await PersonalEvent.create({
      eventTitle,
      eventDescription,
      eventStartDate,
      eventEndDate,
      userId,
    });

    res.send(newEvent);
  } catch (err) {
    handleError(res, err, "Error creating Personal Event.");
  }
};

exports.findAll = async (req, res) => {
  try {
    const events = await PersonalEvent.findAll();
    res.send(events);
  } catch (err) {
    handleError(res, err, "Error retrieving Personal Events.");
  }
};

exports.findAllByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const events = await PersonalEvent.findAll({ where: { userId } });

    if (!events.length) {
      return res.status(404).send({ message: `No Personal Events found for User ID=${userId}.` });
    }

    res.send(events);
  } catch (err) {
    handleError(res, err, "Error retrieving Personal Events by User ID.");
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await PersonalEvent.findByPk(id);

    if (!event) {
      return res.status(404).send({ message: `Personal Event with ID=${id} not found.` });
    }

    res.send(event);
  } catch (err) {
    handleError(res, err, `Error retrieving Personal Event with ID=${req.params.id}.`);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await PersonalEvent.update(req.body, { where: { id } });

    if (updated) {
      res.send({ message: "Personal Event updated successfully." });
    } else {
      res.status(404).send({
        message: `Cannot update Personal Event with ID=${id}. It may not exist or the request body is empty.`,
      });
    }
  } catch (err) {
    handleError(res, err, `Error updating Personal Event with ID=${req.params.id}.`);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PersonalEvent.destroy({ where: { id } });

    if (deleted) {
      res.send({ message: "Personal Event deleted successfully!" });
    } else {
      res.status(404).send({ message: `Cannot delete Personal Event with ID=${id}. It may not exist.` });
    }
  } catch (err) {
    handleError(res, err, `Error deleting Personal Event with ID=${req.params.id}.`);
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deletedCount = await PersonalEvent.destroy({ where: {}, truncate: false });
    res.send({ message: `${deletedCount} Personal Events were deleted successfully!` });
  } catch (err) {
    handleError(res, err, "Error deleting all Personal Events.");
  }
};

exports.deleteAllByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const deletedCount = await PersonalEvent.destroy({ where: { userId }, truncate: false });
    res.send({ message: `${deletedCount} Personal Events for User ID=${userId} were deleted successfully!` });
  } catch (err) {
    handleError(res, err, "Error deleting Personal Events by User ID.");
  }
};
