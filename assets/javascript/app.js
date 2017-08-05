$(document).ready(function() {
	//Initialize firebase
	var config = {
		apiKey: "AIzaSyDqCi-NpMnfvwb4t8QnNQSkDRiCexHY8Lo",
		authDomain: "train-scheduler-6867c.firebaseapp.com",
		databaseURL: "https://train-scheduler-6867c.firebaseio.com",
		projectId: "train-scheduler-6867c",
		storageBucket: "train-scheduler-6867c.appspot.com",
		messagingSenderId: "94786133514"
	  };
	firebase.initializeApp(config);

	//Store database in a variable and set other global variables
	var database = firebase.database();
	var tdOpen = "<td>";
	var tdClose = "</td>";
	var now = moment().format("HH:mm");

	//Create an event to retrieve snapshot from database
	database.ref().on("child_added", function(snapshot) {
		//Store snapshot and its values in variables
		var results = snapshot.val();
		var name = results.name;
		var destination = results.destination;
		var firstTime = results.firstTrainTime;
		var frequency = results.frequency;
		//Store firstTime and format current time
		var firstTimeConverted = moment(firstTime, "HH:mm");
		var currentTime = moment().format("HH:mm");
		//Store difference between current time and first train time
		var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
		//Set variable for the remainder of time till next train
		var remainder = timeDifference % frequency;
		var minutes = frequency - remainder;
		//Calculate the minutes till the next train and store in a variable
		var nextTrain = moment().add(minutes, "minutes").format("HH:mm");
		$("#currentTable").append("<tr>" + tdOpen + results.name + tdClose + tdOpen + results.destination + tdClose + tdOpen + results.frequency + tdClose + tdOpen + nextTrain + tdClose + tdOpen + minutes + tdClose + "</tr>");
	});

	//Add on click for submit button
	$("#addTrain").on("click", function(event) {
		event.preventDefault();
		//Grab user input
		var trainName = $("#trainName").val().trim();
		var destination = $("#destination").val().trim();
		var firstTrainTime = moment($("#firstTrain").val().trim(), "HH:mm").format("HH:mm");
		var frequency = $("#frequency").val().trim();
		//Store user input in an object
		var newTrain = {
			name: trainName,
			destination: destination,
			firstTrainTime: firstTrainTime,
			frequency: frequency
		};
		//Push object data to database and clear form fields
		database.ref().push(newTrain);
		$("#trainName").val("");
		$("#destination").val("");
		$("#firstTrain").val("");
		$("#frequency").val("");
	});
});