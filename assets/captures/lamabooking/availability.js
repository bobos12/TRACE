export const updateRoomAvailability = async (req, res, next) => {
  try {
      // Validate input dates
      const dates = req.body.dates.map(date => {
          const d = new Date(date);
          if (isNaN(d.getTime())) throw new Error(`Invalid date: ${date}`);
          return d;
      });

      // Update room availability
      const result = await Room.findOneAndUpdate(
          { "RoomNumber._id": req.params.id },
          {
              $addToSet: {
                  "RoomNumber.$.unavailableDates": {
                      $each: dates
                  }
              }
          },
          { new: true } // Return the updated document
      );

      if (!result) {
          return res.status(404).json({ message: "Room not found" });
      }

      // Find the specific room number that was updated
      const updatedRoomNumber = result.RoomNumber.find(
          room => room._id.toString() === req.params.id
      );

