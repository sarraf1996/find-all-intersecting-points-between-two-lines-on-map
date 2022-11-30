# Node.js template

This is a Node.js project. It is build using Express.js as backend and used to find all intersecting points with their longitude and latitude coordinates between two lines on a map.

<b>This project uses turf.js library as a dependency to perform geo spatial analysis on GeoJSON data.</b>

<b><i>It takes an input of several points to make a long line and one or more pair of start and end points' coordinates to make another line for testing on whether it will intersect the long line or not.</i></b>

<b>Steps on testing this API with Postman as a client :-</b><br/>
<span>1) Select http method as <b>POST</b> and mention API endpoint as mentioned below.</span><br/>
<span>https://h1lw76-8000.preview.csb.app/find-intersection</span><br/><br/>
<span>2) Go to <b>Headers</b> tab and provide valid email and password with email and password as the keys. In case if you don't have valid crendentials, you can contact me on mobile (<b>+91-9472679634</b>) or via email (sarrafshubham40@gmail.com) regarding this.</span><br/><br/>
<span>3) Provide the inputs in the <b>Body</b> tab as raw JSON format.</span>
<span>Input format and keys name must follow below example.</span>
```yaml
{
    "longLineString":
        {
            "type": "LineString",
            "coordinates":
            [
                [-96.79512, 32.77823],
                [-96.79469, 32.77832],
                [-96.79433, 32.77728],
                [-96.79424, 32.77715],
                [-96.79398, 32.77689]
            ]
        },
    "scatteredLines":
        [
            {
                "line": {
                "type": "LineString",
                "coordinates": [
                    [-74.0386542, 40.7302174],
                    [-74.038756, 40.7295611]
                ]
                }
            },
            {
                "line": {
                "type": "LineString",
                "coordinates": [
                    [-74.061602, 40.705933],
                    [-74.06214, 40.706563]
                ]
                }
            }
        ]
}
```
<span>4) Go to <b>Authorization</b> tab and select <b>Type</b> as <b>Bearer Token</b>. Now under <b>Token</b> field mention {{token}} <i>Note :- variable inside double curly braces denotes Postman environment variable.</i></span><br/><br/>
<span>5) Now go to <b>Tests</b> tab and paste the code as mentioned below.</span><br/>
<span>const generatedToken = pm.response.headers.get("Authorization");</span><br/>
<span>pm.environment.set("token", generatedToken);</span><br/><br/>
<span>6) Click on <b>Send</b> button to send a request to the API.</span><br/><br/>
<span>7) Once you get 200 response status mentioning that the token is generated, you can again Click on <b>Send</b> button to send another request to the API. Since this time you are having token with you and communicating with the API using that, the API will process your request and return the result.</span><br/><br/>
<b>Note :- Token will get generated upon successful authentication via email and password. If you do not have the crendentials, then the token won't be generated at all by the API code and without token you can't access this API as it's a private API.</b><br/><br/>

Add your [configuration](https://codesandbox.io/docs/projects/learn/setting-up/tasks) to optimize it for [CodeSandbox](https://codesandbox.io/p/dashboard).

## Resources

- [CodeSandbox Projects — Docs](https://codesandbox.io/docs/projects)
- [CodeSandbox — Discord](https://discord.gg/Ggarp3pX5H)# Node.js template
