const path = require("path");
const express = require("express");
const app = express(); // create express app

// ----------------------------- Routes -----------------------------

// Serve Static React app files
app.use('/dashboard/static', express.static(path.join(__dirname, "www", "static")));

// Get Request to Dashboard react app
app.get('/dashboard', function(req, res, next) {
	res.sendFile(path.join(__dirname, "www", "app.html"));
});

// Get Request to Root (Login Page)
app.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, "www", "login.html"));
});

// Get Request to Root (Login Page)
app.get('/testapi', function(req, res, next) {
	res.status(200);
});

// Get Request to 404 -> redirect to root
app.use((req, res) => {
	res.status(404).redirect('/');
});

//-------------------------------------------------------------------
/*
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get('/ping', (req, res) => {
	return res.send('------------- pong');
});

app.use('/dashboard', (req, res) => {
	express.static(path.join(__dirname, "..", "client", "build"));
	res.sendFile(path.join(__dirname, "..", "client", "build", "app.html"));
	//return res.send('------------- dashboard');
});

app.get('/', (req, res) => {
	//res.sendFile(path.join(__dirname, "..", "client", "build", "login.html"));
	return res.send('------------- slash');
});

app.use((req, res) => {
	//res.sendFile(path.join(__dirname, "..", "client", "build", "login.html"));
	return res.send('------------- Default');
});
*/
// ---------------------------------------------------------------------------------

//res.status(404).redirect('/MyHomepage')

/*


app.use(express.static("public"));

app.use('/dashboard', (req, res, next) => {
	express.static(path.join(__dirname, "..", "client", "build"));
	res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });

app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "login.html"));
});

*/






// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});