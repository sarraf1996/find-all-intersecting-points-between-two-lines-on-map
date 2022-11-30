import { lineString, lineIntersect } from "@turf/turf";

export const findIntersectionPointForGetMethod = (request, response) => {
  try {
    return response
      .status(200)
      .send("<b>This is the MainPage of FindIntersectionPoint web app.</b>");
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

//Defined arrow function separately to implement reusability in the code
const longitudeAndLatitudeErrorMessage = (response, context) => {
  return response.status(400).json({
    message: `Supplied LineString under ${context} is invalid. Please check longitude and latitude value(s) i.e., longitude ranges from -180 to 180 and latitude ranges from -90 to 90.`,
  });
};

//Defined arrow function separately to implement reusability in the code
const longitudeErrorMessage = (response, context) => {
  return response.status(400).json({
    message: `Supplied LineString under ${context} is invalid. Please check longitude value(s) i.e., ranges from -180 to 180.`,
  });
};

//Defined arrow function separately to implement reusability in the code
const latitudeErrorMessage = (response, context) => {
  return response.status(400).json({
    message: `Supplied LineString under ${context} is invalid. Please check latitude value(s) i.e., ranges from -90 to 90.`,
  });
};

//This arrow function is also defined separately to implement reusability in the code
//It will validate the provided longitude and latitude coordinates
const validateLongitudeAndLatitudeCoordinates = (longitude, latitude) => {
  const validationError = {};
  //Validate longitude coordinate
  if (longitude < -180 || longitude > 180) {
    validationError.longError = true;
  }
  //Validate latitude coordinate
  if (latitude < -90 || latitude > 90) {
    validationError.latError = true;
  }
  return validationError;
};

//This arrow function is a crucial function which will find the intersecting points and return the result
export const findIntersectionPointForPostMethod = async (request, response) => {
  //Attaching provided token to the response headers so that it can be saved again on client's request headers for upcoming requests
  response.setHeader("Authorization", request.user["token"]);
  try {
    //Destructuring request.body
    const { longLineString, scatteredLines } = request.body;

    //Validating request body
    if (!longLineString || !scatteredLines) {
      return response.status(400).json({
        message: "Supplied request body is missing or invalid.",
      });
    }

    //Validating provided longLineString
    for (let i = 0; i < longLineString.coordinates.length; ++i) {
      //Validating no. of coordinates of a point i.e., 2 coordinates (longitude, latitude)
      if (longLineString.coordinates[i].length !== 2) {
        return response.status(400).json({
          message:
            "Supplied LineString under longLineString is invalid. A point must have exactly two coordinates.",
        });
      }
      //Validating longitude and latitude coordinates
      const validationError = validateLongitudeAndLatitudeCoordinates(
        longLineString.coordinates[i][0],
        longLineString.coordinates[i][1]
      );
      //Handling response based on validation result
      const { longError, latError } = validationError;
      if (longError && latError) {
        return longitudeAndLatitudeErrorMessage(response, "longLineString");
      } else if (longError) {
        return longitudeErrorMessage(response, "longLineString");
      } else if (latError) {
        return latitudeErrorMessage(response, "longLineString");
      }
    }

    //Validating provided scatteredLines
    for (let j = 0; j < scatteredLines.length; ++j) {
      //Validating no. of points to make a line i.e., 2 points
      if (scatteredLines[j].line.coordinates.length !== 2) {
        return response.status(400).json({
          message:
            "Supplied LineString under scatteredLines is invalid. Please provide exactly two points to make a line.",
        });
      }
      //This loop will run 2 times only. So, overall time complexity will be
      //Theta(2n) equals Theta(n) only, where n is scatteredLines.length
      for (let k = 0; k < 2; ++k) {
        //Validating no. of coordinates of a point i.e., 2 coordinates (longitude, latitude)
        if (scatteredLines[j].line.coordinates[k].length !== 2) {
          return response.status(400).json({
            message:
              "Supplied LineString under scatteredLines is invalid. A point must have exactly two coordinates.",
          });
        }
        //Validating longitude and latitude coordinates
        const validationError = validateLongitudeAndLatitudeCoordinates(
          scatteredLines[j].line.coordinates[k][0],
          scatteredLines[j].line.coordinates[k][1]
        );
        //Handling response based on validation result
        const { longError, latError } = validationError;
        if (longError && latError) {
          return longitudeAndLatitudeErrorMessage(response, "scatteredLines");
        } else if (longError) {
          return longitudeErrorMessage(response, "scatteredLines");
        } else if (latError) {
          return latitudeErrorMessage(response, "scatteredLines");
        }
      }
    }

    //Crucial business logic begins
    //Converting all provided points (approx 5k) to a long LineString
    const longLineStringFormed = lineString(longLineString.coordinates);
    const result = [];
    //Iterating over provided scattered lines one by one and check whether it will intersect
    //above calculated long LineString or not
    scatteredLines.forEach((currLineObj, lineIndex) => {
      //Creating scattered line as LineString using provided start and end points' coordinates
      const currLineStringFormed = lineString(currLineObj.line.coordinates);

      //This will check whether the current scattered line formed will intersect above calculated
      //long LineString or not
      const intersects = lineIntersect(
        currLineStringFormed,
        longLineStringFormed
      );
      //If intersection point(s) is/are found, they are pushed to the result array and returned
      //and if no intersection point found then an empty result array will be returned to the user
      if ("features" in intersects && intersects.features.length !== 0) {
        if ("geometry" in intersects.features[0]) {
          result.push({
            intersectingLineId: lineIndex + 1,
            pointOfIntersection: intersects.features[0].geometry.coordinates,
          });
        }
      }
    });
    return response.status(200).json({ result: result });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};
