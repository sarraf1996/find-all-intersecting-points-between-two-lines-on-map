const homePage = (request, response) => {
  try {
    return response.status(200).send(
      `This is the HomePage of FindIntersectionPoint web app.
        <br/><br/>
        Please mention <b>/find-intersection</b> in the url to access the application.`
    );
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

export default homePage;
